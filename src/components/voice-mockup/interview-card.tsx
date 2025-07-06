
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InterviewCardProps {
  question: string;
  onAnswerSubmit: (answer: string) => void;
  isAnalyzing: boolean;
}

export function InterviewCard({ question, onAnswerSubmit, isAnalyzing }: InterviewCardProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Speech Recognition Not Supported',
        description: 'Your browser does not support speech recognition. Please try Chrome or Edge.',
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript((prev) => prev + finalTranscript);
    };
    
    recognition.onerror = (event) => {
      toast({
        variant: 'destructive',
        title: 'Speech Recognition Error',
        description: `Error: ${event.error}. Please ensure microphone access is allowed.`,
      });
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [toast]);

  const handleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };
  
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      toast({ title: 'Text-to-speech not supported in this browser.' });
    }
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onAnswerSubmit(transcript);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-2xl animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{question}</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => speak(question)}>
            <Volume2 className="mr-2 h-4 w-4" />
            Read Aloud
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Answer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Your transcribed answer will appear here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={6}
            className="text-base"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleRecording} className="w-full sm:w-auto" variant={isRecording ? 'destructive' : 'default'}>
              {isRecording ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {isRecording ? 'Stop Recording' : 'Record Answer'}
            </Button>
            <Button onClick={handleSubmit} className="w-full sm:w-auto bg-accent hover:bg-accent/90" disabled={!transcript.trim() || isAnalyzing}>
              {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isAnalyzing ? 'Analyzing...' : 'Submit Answer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
