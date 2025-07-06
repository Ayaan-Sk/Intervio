
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, Speaker, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { InterviewVoice } from './voice-mockup-app';

interface InterviewCardProps {
  question: string;
  voice: InterviewVoice;
  onAnswerSubmit: (answer: string) => void;
  isAnalyzing: boolean;
}

export function InterviewCard({ question, voice, onAnswerSubmit, isAnalyzing }: InterviewCardProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Speech recognition could not be started, may already be active.', e);
        if (!isRecording) setIsRecording(true);
      }
    }
  }, [isRecording]);

  // Effect to handle browser Text-to-Speech
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    recognitionRef.current?.stop();
    setIsRecording(false);
    setTranscript('');

    if (!question) return;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(question);
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        startRecording();
      };
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        console.error('SpeechSynthesis Error:', event.error);
        toast({
          variant: 'destructive',
          title: 'Text-to-Speech Error',
          description: 'Could not play audio. Starting recording directly.',
        });
        startRecording();
      };

      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (voice === 'male' ? /male/i.test(v.name) : /female/i.test(v.name))
        );
        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.startsWith('en'));
        }
        if (selectedVoice) utterance.voice = selectedVoice;
        
        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
      } else {
        setVoiceAndSpeak();
      }
    } else {
      toast({
        title: 'Text-to-Speech Not Supported',
        description: 'Starting recording immediately.',
      });
      setTimeout(() => startRecording(), 500);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      recognitionRef.current?.stop();
      setIsSpeaking(false);
    };
  }, [question, voice, startRecording, toast]);

  // Effect to initialize SpeechRecognition
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

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.stop();
    }
  }, [toast]);

  const handleSubmit = () => {
    if (transcript.trim()) {
      recognitionRef.current?.stop();
      onAnswerSubmit(transcript);
    }
  };

  const getStatusMessage = () => {
    if (isSpeaking) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Volume2 />
          <span>Listen to the question.</span>
        </div>
      );
    }
    if (isRecording) {
      return (
        <div className="flex items-center gap-2 text-red-500">
          <Mic />
          <span>Recording... Speak now.</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Speaker />
        <span>Prepare to answer.</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full max-w-2xl animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{question}</CardTitle>
        </CardHeader>
        <CardContent>
          {getStatusMessage()}
        </CardContent>
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
            <Button onClick={handleSubmit} className="w-full bg-accent hover:bg-accent/90" disabled={!transcript.trim() || isAnalyzing}>
              {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isAnalyzing ? 'Analyzing...' : 'Submit Answer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
