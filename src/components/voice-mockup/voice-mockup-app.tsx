'use client';

import { useState } from 'react';
import { analyzeAnswerQuality } from '@/app/actions';
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
    'What is React and why is it used?',
    'What are components in React?',
    'What is the difference between props and state?',
    'What is JSX?',
    'What are functional and class components?',
    'How does the Virtual DOM work in React?',
    'What is the purpose of keys in a list?',
    'What is a controlled component in React?',
    'How does React handle form inputs?',
    'What are React hooks?',
    'What does the useState hook do?',
    'What is the useEffect hook used for?',
    'What is prop drilling and how can it be avoided?',
    'What are fragments in React?',
    'How do you conditionally render components in React?',
    'What is the purpose of useRef?',
    'How do you handle side effects in React?',
    'What is the Context API and when would you use it?',
    'What are custom hooks and why are they useful?',
    'What is the difference between useMemo and useCallback?',
    'What is reconciliation in React?',
    'What are Higher Order Components (HOCs)?',
    'What is lazy loading in React and how is it implemented?',
    'What is code splitting?',
    'How does React optimize performance during re-renders?',
    'What are pure components?',
    'How does React differ from other frameworks like Angular or Vue?',
    'What is React Router and how does it work?',
    'How do you pass parameters in React Router?',
    'What are the differences between useEffect and componentDidMount?',
    'What is Redux and why is it used with React?',
    'What are actions, reducers, and the store in Redux?',
    'What is the difference between Redux and Context API?',
    'What are middleware in Redux?',
    'What is the useReducer hook?',
    'How do you deploy a React application?',
    'What is Create React App (CRA)?',
    'What is the difference between CRA and Vite?',
    'How can you improve performance in a large React application?',
    'What is tree shaking?',
    'How do you secure a React app?',
    'What are common React anti-patterns to avoid?',
    'How can you handle errors in React components?',
    'What is the purpose of error boundaries?',
    'What is Server-Side Rendering (SSR) in React?',
    'What is hydration in React?',
    'How does React handle accessibility (a11y)?',
    'How can you test a React component?',
    'What is snapshot testing?',
    'What are best practices for structuring a scalable React project?',
  ],
  'docker': [
    'What is a Docker container, and how does it differ from a virtual machine?',
    'Explain the purpose of a Dockerfile. What are some common instructions you would use in one?',
  ],
  'kubernetes': [
    'What is a Pod in Kubernetes?',
    'Describe the difference between a Deployment and a StatefulSet in Kubernetes.',
  ],
  'general': [
    'Tell me about a challenging technical problem you solved recently.',
    'How do you approach learning a new technology or programming language?',
    'Describe your experience with version control systems like Git.',
  ],
  'javascript': ['What is a closure in JavaScript?'],
  'typescript': ['What is the difference between an interface and a type in TypeScript?'],
  'python': ['Explain the difference between a list and a tuple in Python.'],
  'java': ['What is the difference between `==` and `.equals()` in Java?'],
  'c++': ['What is a virtual function in C++?'],
  'c#': ['What is the Common Language Runtime (CLR) in .NET?'],
  'go': ['What are goroutines and how do they differ from threads?'],
  'rust': ['What is the ownership model in Rust?'],
  'swift': ['What is the difference between a class and a struct in Swift?'],
  'kotlin': ['What are extension functions in Kotlin?'],
  'ruby': ['What is the difference between a block, a proc, and a lambda in Ruby?'],
  'php': ['What are Traits in PHP?'],
  'scala': ['What is a case class in Scala?'],
  'sql': ['What is the difference between `UNION` and `UNION ALL`?'],
  'html': ['What is the purpose of the `<!DOCTYPE html>` declaration?'],
  'css': ['What is the CSS box model?'],
};

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
  
  const handleTopicSubmit = (submittedTopics: string[], selectedVoice: InterviewVoice) => {
    setIsGenerating(true);
    setTopics(submittedTopics);
    setVoice(selectedVoice);

    const questionPool = submittedTopics.flatMap(topic => DUMMY_QUESTIONS[topic] || []);
    
    // Select 3 random questions from the pool without repetition
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 3);

    setQuestions(selectedQuestions);
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
            voice={voice}
            onAnswerSubmit={handleAnswerSubmit}
            isAnalyzing={isAnalyzing}
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
      {(step === 'interview' || step === 'feedback') && questions.length > 0 && (
        <div className="w-full max-w-2xl">
          <p className="text-sm text-center text-muted-foreground mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
        </div>
      )}
      {renderStep()}
    </div>
  );
}
