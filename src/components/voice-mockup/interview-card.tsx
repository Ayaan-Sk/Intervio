
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
  const isRecordingRef = useRef(false);

  const startRecording = useCallback(() => {
    // Use the ref to prevent starting an already-running recognition
    if (recognitionRef.current && !isRecordingRef.current) {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Speech recognition could not be started, may already be active.', e);
      }
    }
  }, []); // Empty dependency array makes this function stable

  // Effect to initialize SpeechRecognition on mount
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
      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript.trim() + ' ');
      }
    };
    
    recognition.onerror = (event) => {
      toast({
        variant: 'destructive',
        title: 'Speech Recognition Error',
        description: `Error: ${event.error}. Please ensure microphone access is allowed.`,
      });
      setIsRecording(false);
      isRecordingRef.current = false;
    };

    recognition.onstart = () => {
      setIsRecording(true);
      isRecordingRef.current = true;
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      isRecordingRef.current = false;
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  // Effect to handle Text-to-Speech when the question changes
  useEffect(() => {
    if (!question || !('speechSynthesis' in window)) {
      return;
    }

    // Stop any previous actions before starting new ones.
    window.speechSynthesis.cancel();
    if (recognitionRef.current && isRecordingRef.current) {
      recognitionRef.current.stop();
    }

    // Reset state for the new question.
    setTranscript('');
    setIsRecording(false);
    isRecordingRef.current = false;
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(question);

    utterance.onend = () => {
      setIsSpeaking(false);
      // A short delay can help ensure the audio channel is released before recording starts.
      setTimeout(() => startRecording(), 100);
    };

    utterance.onerror = (event) => {
      // The 'interrupted' error is expected when the component unmounts or the question changes.
      // We can safely ignore it to avoid showing an unnecessary error toast.
      if (event.error === 'interrupted') {
        console.log('Speech synthesis interrupted, this is expected on question change.');
        return;
      }

      setIsSpeaking(false);
      console.error('SpeechSynthesis Error:', event.error);
      toast({
        variant: 'destructive',
        title: 'Text-to-Speech Error',
        description: 'Could not play audio. Starting recording directly.',
      });
      // Fallback to recording if speech fails for other reasons.
      startRecording();
    };

    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        let selectedVoice = voices.find(v =>
          v.lang.startsWith('en') &&
          (voice === 'male' ? /male/i.test(v.name) : /female/i.test(v.name))
        );
        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.startsWith('en'));
        }
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      window.speechSynthesis.speak(utterance);
    };

    // The voices list might load asynchronously.
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    } else {
      setVoiceAndSpeak();
    }

    // The cleanup function is crucial to stop speech when the component unmounts
    // or when this effect re-runs for a new question.
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [question, voice, startRecording, toast]);

  const handleSubmit = () => {
    if (transcript.trim()) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
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
