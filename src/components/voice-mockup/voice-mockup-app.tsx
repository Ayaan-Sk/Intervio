
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
export type InterviewVoice = 'male' | 'female';

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

// Use a simple in-memory cache for audio to reduce API calls
const audioCache = new Map<string, string>();

export function VoiceMockupApp() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('topic');
  const [topic, setTopic] = useState('');
  const [voice, setVoice] = useState<InterviewVoice>('male');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFetchingAudio, setIsFetchingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);

  useEffect(() => {
    if (step === 'interview' && questions.length > 0) {
      const fetchAudio = async () => {
        setIsFetchingAudio(true);
        setCurrentAudio(null);
        const questionText = questions[currentQuestionIndex];
        
        if (audioCache.has(questionText)) {
          setCurrentAudio(audioCache.get(questionText)!);
          setIsFetchingAudio(false);
          return;
        }

        const { audioDataUri, error } = await textToSpeech({ text: questionText, voice });

        if (error) {
          toast({
            variant: 'destructive',
            title: 'Text-to-Speech Error',
            description: error,
          });
        } else if (audioDataUri) {
          audioCache.set(questionText, audioDataUri);
          setCurrentAudio(audioDataUri);
        }
        setIsFetchingAudio(false);
      };
      fetchAudio();
    }
  }, [step, currentQuestionIndex, questions, voice, toast]);
  
  const handleTopicSubmit = (submittedTopic: string, selectedVoice: InterviewVoice) => {
    setIsGenerating(true);
    setTopic(submittedTopic);
    setVoice(selectedVoice);

    const topicKey = Object.keys(DUMMY_QUESTIONS).find(key => 
      submittedTopic.toLowerCase().includes(key) && key !== 'default'
    );
    
    const questionPool = topicKey ? DUMMY_QUESTIONS[topicKey] : DUMMY_QUESTIONS['default'];
    // Using an array with one question to simulate a shorter interview and avoid API rate limits on analysis.
    const selectedQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];

    setQuestions([selectedQuestion]);
    setCurrentAudio(null);
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
    setCurrentAudio(null);
  };

  const renderStep = () => {
    switch (step) {
      case 'topic':
        return <TopicForm onSubmit={handleTopicSubmit} isGenerating={isGenerating} />;
      
      case 'interview':
        return (
          <InterviewCard
            question={questions[currentQuestionIndex]}
            audioDataUri={currentAudio}
            onAnswerSubmit={handleAnswerSubmit}
            isAnalyzing={isAnalyzing}
            isFetchingAudio={isFetchingAudio}
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
