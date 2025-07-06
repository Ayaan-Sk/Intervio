
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, Speaker } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { textToSpeech } from '@/app/actions';
import type { InterviewVoice } from './voice-mockup-app';

interface InterviewCardProps {
  question: string;
  onAnswerSubmit: (answer: string) => void;
  isAnalyzing: boolean;
  voice: InterviewVoice;
}

export function InterviewCard({ question, onAnswerSubmit, isAnalyzing, voice }: InterviewCardProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      setTranscript('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  }, [isRecording]);

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

    // Cleanup on unmount
    return () => {
      recognitionRef.current?.stop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, [toast]);
  

  useEffect(() => {
    if (question && voice) {
      setIsSpeaking(true);
      // Reset transcript for new question
      setTranscript('');
      textToSpeech({ text: question, voice })
        .then(({ audioDataUri }) => {
          const audio = new Audio(audioDataUri);
          audioRef.current = audio;
          audio.play();
          audio.onended = () => {
            setIsSpeaking(false);
            startRecording();
          };
          audio.onerror = () => {
            // Handle audio playback error
             toast({
                variant: 'destructive',
                title: 'Audio Playback Error',
                description: 'Could not play the question audio.',
            });
            setIsSpeaking(false);
            startRecording();
          }
        })
        .catch(err => {
          console.error(err);
          toast({
            variant: 'destructive',
            title: 'Text-to-Speech Error',
            description: 'Could not generate audio for the question.',
          });
          setIsSpeaking(false);
          // Even if TTS fails, allow user to record
          startRecording();
        });
    }

    return () => {
        if(audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        if(recognitionRef.current){
            recognitionRef.current.stop();
        }
    }
  }, [question, voice, toast, startRecording]);


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
          <Loader2 className="animate-spin" />
          <span>Interviewer is speaking...</span>
        </div>
      )
    }
    if (isRecording) {
      return (
        <div className="flex items-center gap-2 text-red-500">
          <Mic />
          <span>Recording... Speak now.</span>
        </div>
      )
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
            disabled={isSpeaking}
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSubmit} className="w-full bg-accent hover:bg-accent/90" disabled={!transcript.trim() || isAnalyzing || isSpeaking}>
              {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isAnalyzing ? 'Analyzing...' : 'Submit Answer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
