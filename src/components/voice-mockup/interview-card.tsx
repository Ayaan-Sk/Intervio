
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, Speaker, Volume2, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InterviewCardProps {
  question: string;
  audioDataUri: string | null;
  onAnswerSubmit: (answer: string) => void;
  isAnalyzing: boolean;
  isFetchingAudio: boolean;
}

export function InterviewCard({ question, audioDataUri, onAnswerSubmit, isAnalyzing, isFetchingAudio }: InterviewCardProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      setTranscript(Array.from(event.results).map(r => r[0].transcript).join(''));
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
          return;
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
      recognitionRef.current?.stop();
    };
  }, [toast]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const playAudio = () => {
      audio.play()
        .then(() => setIsSpeaking(true))
        .catch(err => {
          console.error("Audio playback failed:", err);
          toast({
            variant: 'destructive',
            title: 'Audio Playback Error',
            description: 'Could not play audio automatically. Proceeding to recording.',
          });
          setIsSpeaking(false);
          startRecording();
        });
    };

    const handleAudioEnd = () => {
      setIsSpeaking(false);
      startRecording();
    };
    
    audio.addEventListener('canplay', playAudio);
    audio.addEventListener('ended', handleAudioEnd);

    if (audioDataUri) {
      audio.src = audioDataUri;
    } else if (!isFetchingAudio) {
      startRecording();
    }

    return () => {
      audio.removeEventListener('canplay', playAudio);
      audio.removeEventListener('ended', handleAudioEnd);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audioDataUri, isFetchingAudio, startRecording, toast]);

  const handleSubmit = () => {
    if (transcript.trim()) {
      stopRecording();
      onAnswerSubmit(transcript);
    }
  };

  const getStatusMessage = () => {
    if (isFetchingAudio) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
          <Bot /> <span>Generating audio...</span>
        </div>
      );
    }
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
      
      <audio ref={audioRef} className="hidden" />

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
