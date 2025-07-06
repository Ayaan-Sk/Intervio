
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, Speaker, Volume2, Bot } from 'lucide-react';
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

  const isRecordingRef = useRef(isRecording);
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecordingRef.current) {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.warn('Speech recognition could not be started: ', e);
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecordingRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, []);

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
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = `An unknown error occurred: ${event.error}.`;
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech was detected. Please make sure your microphone is working.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not available. Please ensure it is connected and enabled.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.';
          break;
        case 'network':
          errorMessage = 'A network error occurred during speech recognition.';
          break;
        case 'aborted':
          // Don't show an error if the user intentionally stopped the recording
          if (isRecordingRef.current) {
            errorMessage = 'Speech recognition was aborted.';
          } else {
            return;
          }
          break;
      }
      toast({
        variant: 'destructive',
        title: 'Speech Recognition Error',
        description: errorMessage,
      });
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.abort();
    };
  }, [toast]);
  
  useEffect(() => {
    if (!question || typeof window === 'undefined' || !window.speechSynthesis) return;

    const speak = () => {
        // Cancel any previous speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(question);
        
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice: SpeechSynthesisVoice | undefined;

        if (voice === 'male') {
          selectedVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('David') || v.name.includes('Male')) || voices.find(v => v.lang.startsWith('en') && v.name.includes('Male'));
        } else {
          selectedVoice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Zira') || v.name.includes('Female')) || voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'));
        }
        
        utterance.voice = selectedVoice || voices.find(v => v.lang.startsWith('en')) || voices[0];
        
        utterance.onstart = () => {
          setIsSpeaking(true);
        };
        
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
            description: 'Could not play the question audio. Please ensure your browser supports Web Speech API.',
          });
          // Fallback to recording immediately
          startRecording();
        };

        window.speechSynthesis.speak(utterance);
    }

    // voices are loaded asynchronously.
    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = speak;
    } else {
        speak();
    }
    
    return () => {
        window.speechSynthesis.cancel();
        stopRecording();
    };
  }, [question, voice, startRecording, stopRecording, toast]);

  const handleSubmit = () => {
    if (transcript.trim()) {
      stopRecording();
      onAnswerSubmit(transcript);
    }
  };

  const getStatusMessage = () => {
    if (isSpeaking) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Volume2 /> <span>Listen to the question.</span>
        </div>
      );
    }
    if (isRecording) {
      return (
        <div className="flex items-center gap-2 text-red-500">
          <Mic /> <span>Recording... Speak now.</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Speaker /> <span>Prepare to answer.</span>
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
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAnalyzing ? 'Analyzing...' : 'Submit Answer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
