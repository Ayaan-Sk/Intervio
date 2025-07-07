
'use client';

import { useState, useEffect } from 'react';
import { TopicForm } from './topic-form';
import { InterviewCard } from './interview-card';
import { FeedbackCard } from './feedback-card';
import { InterviewSummary } from './interview-summary';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { analyzeAnswerQuality } from '@/ai/flows/analyze-answer-quality';
import { generateInterviewQuestions } from '@/ai/flows/generate-interview-questions';


interface AnalysisResult {
  sentiment: string;
  qualityRating: number;
  talkingPoints: string[];
  justification:string;
  answer: string;
}

type Step = 'topic' | 'interview' | 'feedback' | 'summary';
export type InterviewVoice = 'male' | 'female';

export function VoiceMockupApp() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('topic');
  const [topics, setTopics] = useState<string[]>([]);
  const [voice, setVoice] = useState<InterviewVoice>('male');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (step !== 'interview' && step !== 'feedback') {
        if (timeLeft !== 15 * 60) setTimeLeft(15 * 60); // Reset timer if not in interview
        return;
    };

    if (timeLeft <= 0) {
      toast({
        title: "Time's Up!",
        description: 'Moving to the summary.',
      });
      setStep('summary');
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [step, timeLeft, toast]);
  
  const handleTopicSubmit = async (submittedTopics: string[], selectedVoice: InterviewVoice) => {
    setIsGenerating(true);
    setTopics(submittedTopics);
    setVoice(selectedVoice);
    setTimeLeft(15 * 60); // Reset timer

    try {
      const { questions: generatedQuestions } = await generateInterviewQuestions({ topics: submittedTopics });
      
      if (!generatedQuestions || generatedQuestions.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Question Generation Failed',
          description: 'Could not generate questions. Please try again.',
        });
        setIsGenerating(false);
        return;
      }

      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setResults([]);
      setStep('interview');

    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        variant: 'destructive',
        title: 'Question Generation Failed',
        description: 'There was an error preparing your interview. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    setIsAnalyzing(true);
    try {
      const question = questions[currentQuestionIndex];
      const analysisResult = await analyzeAnswerQuality({ question, answer });
      
      const finalResult: AnalysisResult = {
        ...analysisResult,
        answer,
      };

      setResults(prev => [...prev, finalResult]);
      setStep('feedback');
    } catch (error) {
      console.error('Error analyzing answer:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'There was an error analyzing your answer. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setStep('interview');
    } else {
      setStep('summary');
    }
  };

  const handleRestart = () => {
    setStep('topic');
    setTopics([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setResults([]);
  };

  const renderStep = () => {
    switch (step) {
      case 'topic':
        return <TopicForm onSubmit={handleTopicSubmit} isGenerating={isGenerating} />;
      
      case 'interview':
        return (
          <InterviewCard
            question={questions[currentQuestionIndex]}
            topics={topics}
            voice={voice}
            onAnswerSubmit={handleAnswerSubmit}
            isAnalyzing={isAnalyzing}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            timeLeft={timeLeft}
            onLeave={handleRestart}
          />
        );

      case 'feedback':
        const latestResult = results[currentQuestionIndex];
        return (
          <div className="w-full max-w-2xl space-y-6 animate-fade-in">
              {latestResult && <FeedbackCard result={latestResult} />}
              <Button onClick={handleNext} className="w-full" disabled={isAnalyzing}>
                {isAnalyzing ? <span className="animate-pulse">Analyzing...</span> : currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
              </Button>
          </div>
        );
        
      case 'summary':
        return <InterviewSummary results={results} questions={questions} onRestart={handleRestart} />;
        
      default:
        return null;
    }
  };

  const containerClass = (step === 'interview')
    ? "w-full py-4 px-4 flex flex-col items-center"
    : "container mx-auto py-8 px-4 flex flex-col items-center gap-8";

  return (
    <div className={containerClass}>
      {(step === 'feedback') && questions.length > 0 && (
        <div className="w-full max-w-2xl">
          <p className="text-sm text-center text-muted-foreground mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
        </div>
      )}
      {renderStep()}
    </div>
  );
}
