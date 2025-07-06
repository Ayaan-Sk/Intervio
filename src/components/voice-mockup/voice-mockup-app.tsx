
'use client';

import { useState } from 'react';
import { generateInterviewQuestions, analyzeAnswerQuality } from '@/app/actions';
import { TopicForm } from './topic-form';
import { InterviewCard } from './interview-card';
import { FeedbackCard } from './feedback-card';
import { InterviewSummary } from './interview-summary';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  sentiment: string;
  qualityRating: number;
  talkingPoints: string[];
  justification:string;
  answer: string;
}

type Step = 'topic' | 'interview' | 'feedback' | 'summary';
export type InterviewVoice = 'Algenib' | 'Achernar';

export function VoiceMockupApp() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('topic');
  const [topic, setTopic] = useState('');
  const [voice, setVoice] = useState<InterviewVoice>('Algenib');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTopicSubmit = async (submittedTopic: string, selectedVoice: InterviewVoice) => {
    setIsGenerating(true);
    setTopic(submittedTopic);
    setVoice(selectedVoice);
    try {
      const { questions: generatedQuestions } = await generateInterviewQuestions({ technicalTopic: submittedTopic });
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setStep('interview');
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to generate questions',
          description: 'Could not generate questions for this topic. Please try another one.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred while generating questions.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeAnswerQuality({
        question: questions[currentQuestionIndex],
        answer,
      });
      setResults(prev => [...prev, { ...analysis, answer }]);
      setStep('feedback');
    } catch (error) {
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
    setTopic('');
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
            onAnswerSubmit={handleAnswerSubmit}
            isAnalyzing={isAnalyzing}
            voice={voice}
          />
        );

      case 'feedback':
        const lastResult = results[results.length - 1];
        return (
          <div className="w-full max-w-2xl space-y-6 animate-fade-in">
              {lastResult && <FeedbackCard result={lastResult} />}
              <Button onClick={handleNext} className="w-full">
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
              </Button>
          </div>
        );
        
      case 'summary':
        return <InterviewSummary results={results} questions={questions} onRestart={handleRestart} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col items-center gap-8">
      {(step === 'interview' || step === 'feedback') && (
        <div className="w-full max-w-2xl">
          <p className="text-sm text-center text-muted-foreground mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
        </div>
      )}
      {renderStep()}
    </div>
  );
}
