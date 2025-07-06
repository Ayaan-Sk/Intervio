
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, Speaker, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InterviewCardProps {
  question: string;
  onAnswerSubmit: (answer: string) => void;
  isAnalyzing: boolean;
  audioSrc: string | null;
  isReadingQuestion: boolean;
}

export function InterviewCard({ question, onAnswerSubmit, isAnalyzing, audioSrc, isReadingQuestion }: InterviewCardProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.warn('Speech recognition could not be started, may already be active.', e);
        if (!isRecording) setIsRecording(true);
      }
    }
  }, [isRecording]);

  useEffect(() => {
    // Reset state when question changes
    setTranscript('');
    setIsRecording(false);
    recognitionRef.current?.stop();
    if(audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  }, [question]);

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

    return () => {
      recognitionRef.current?.stop();
    }
  }, [toast]);
  
  useEffect(() => {
    if (audioSrc && audioSrc !== 'error' && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed", e);
        toast({
          variant: 'destructive',
          title: 'Audio Playback Blocked',
          description: 'Please interact with the page to enable audio. Starting recording.',
        });
        startRecording();
      });
    } else if (audioSrc === 'error') {
      // TTS failed, start recording immediately.
      const timer = setTimeout(() => startRecording(), 500); // Small delay to allow UI to update
      return () => clearTimeout(timer);
    }
  }, [audioSrc, startRecording, toast]);

  const handleSubmit = () => {
    if (transcript.trim()) {
      recognitionRef.current?.stop();
      onAnswerSubmit(transcript);
    }
  };

  const getStatusMessage = () => {
    if (isReadingQuestion) {
      return (
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="animate-spin" />
          <span>Generating question audio...</span>
        </div>
      );
    }
    if (audioSrc && audioSrc !== 'error' && !isRecording && !audioRef.current?.ended) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Volume2 />
          <span>Listen to the question. Recording will start after.</span>
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
      <audio 
        ref={audioRef} 
        src={audioSrc && audioSrc !== 'error' ? audioSrc : undefined}
        onEnded={startRecording}
        hidden
      />
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
