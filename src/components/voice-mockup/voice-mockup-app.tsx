
'use client';

import { useState, useEffect } from 'react';
import { analyzeAnswerQuality, textToSpeech } from '@/app/actions';
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
export type InterviewVoice = 'Algenib' | 'Electra';

const DUMMY_QUESTIONS: Record<string, string[]> = {
  'react': [
    'What is the difference between `useState` and `useRef` in React?',
    'Explain the purpose of the `useEffect` hook. Provide an example of how you would use it to fetch data.',
  ],
  'docker': [
    'What is a Docker container, and how does it differ from a virtual machine?',
    'Explain the purpose of a Dockerfile. What are some common instructions you would use in one?',
  ],
  'kubernetes': [
    'What is a Pod in Kubernetes?',
    'Describe the difference between a Deployment and a StatefulSet in Kubernetes.',
  ],
  'default': [
    'Tell me about a challenging technical problem you solved recently.',
    'How do you approach learning a new technology or programming language?',
    'Describe your experience with version control systems like Git.',
  ]
};

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
  
  const [ttsCache, setTtsCache] = useState<Record<string, string>>({});
  const [currentAudioSrc, setCurrentAudioSrc] = useState<string | null>(null);
  const [isReadingQuestion, setIsReadingQuestion] = useState(false);

  useEffect(() => {
    if (step === 'interview') {
      const fetchAudio = async () => {
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        const cacheKey = `${voice}:${currentQuestion}`;
        if (ttsCache[cacheKey]) {
          setCurrentAudioSrc(ttsCache[cacheKey]);
          return;
        }

        setIsReadingQuestion(true);
        setCurrentAudioSrc(null);
        try {
          const response = await textToSpeech({ text: currentQuestion, voice });
          if (response.audioDataUri) {
            setTtsCache(prev => ({ ...prev, [cacheKey]: response.audioDataUri }));
            setCurrentAudioSrc(response.audioDataUri);
          } else {
            throw new Error(response.error || 'No audio data URI in response');
          }
        } catch (error) {
          console.error("Failed to get TTS audio", error);
          toast({
            variant: 'destructive',
            title: 'Text-to-Speech Failed',
            description: 'Could not play audio. Recording will start now.',
          });
          setTtsCache(prev => ({...prev, [cacheKey]: 'error'}));
          setCurrentAudioSrc('error');
        } finally {
          setIsReadingQuestion(false);
        }
      };
      fetchAudio();
    }
  }, [step, currentQuestionIndex, questions, voice, toast, ttsCache]);

  const handleTopicSubmit = (submittedTopic: string, selectedVoice: InterviewVoice) => {
    setIsGenerating(true);
    setTopic(submittedTopic);
    setVoice(selectedVoice);

    const topicKey = Object.keys(DUMMY_QUESTIONS).find(key => 
      submittedTopic.toLowerCase().includes(key) && key !== 'default'
    );
    
    const questionPool = topicKey ? DUMMY_QUESTIONS[topicKey] : DUMMY_QUESTIONS['default'];
    const selectedQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];

    setQuestions([selectedQuestion]); // Using an array with one question to avoid API rate limits.
    setStep('interview');
    
    // Using a timeout to make the UI transition feel smoother
    setTimeout(() => setIsGenerating(false), 300);
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
    setCurrentAudioSrc(null);
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
            audioSrc={currentAudioSrc}
            isReadingQuestion={isReadingQuestion}
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
