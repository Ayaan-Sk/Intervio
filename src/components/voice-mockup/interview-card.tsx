
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Mic, Bot, ArrowLeft, PauseCircle, Smile, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { InterviewVoice } from './voice-mockup-app';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface InterviewCardProps {
  question: string;
  topics: string[];
  voice: InterviewVoice;
  onAnswerSubmit: (answer: string) => void;
  isAnalyzing: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  onLeave: () => void;
}

export function InterviewCard({ 
  question, topics, voice, onAnswerSubmit, isAnalyzing, 
  currentQuestionIndex, totalQuestions, timeLeft, onLeave 
}: InterviewCardProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Camera Permission Effect
  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
            variant: 'destructive',
            title: 'Camera Not Supported',
            description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to continue.',
        });
      }
    };
    getCameraPermission();
  }, [toast]);

  // Speech Recognition Setup Effect
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
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(transcript => finalTranscript + interimTranscript);
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // ... error handling
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.abort();
    };
  }, [toast]);
  
  // Text-to-Speech Effect
  useEffect(() => {
    if (!question || typeof window === 'undefined' || !window.speechSynthesis) return;

    const speak = () => {
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
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => { setIsSpeaking(false); startRecording(); };
        utterance.onerror = () => { setIsSpeaking(false); startRecording(); };
        window.speechSynthesis.speak(utterance);
    }

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
    stopRecording();
    if (transcript.trim()) {
      onAnswerSubmit(transcript);
    } else {
        toast({
            variant: 'destructive',
            title: 'No Answer Detected',
            description: 'Please provide an answer before submitting.',
        });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const topicTitle = topics.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' / ') + ' Developer';

  return (
    <div className="w-full max-w-5xl animate-fade-in space-y-4">
      <header className="flex justify-between items-center px-1">
        <h1 className="text-xl md:text-2xl font-bold">{topicTitle}</h1>
        <Button variant="outline" onClick={onLeave}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Leave Interview
        </Button>
      </header>

      <Card className="bg-background/80 backdrop-blur-sm">
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="w-full md:w-1/2">
              <p className="text-sm text-muted-foreground mb-1">Question {currentQuestionIndex + 1}/{totalQuestions}</p>
              <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} />
            </div>
            <div className="text-sm font-medium bg-muted text-muted-foreground px-3 py-1.5 rounded-md">
              Total remaining time <span className="font-mono text-foreground">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-lg border aspect-video flex items-center justify-center overflow-hidden">
                <Image 
                    src="https://placehold.co/800x450.png"
                    alt="AI Interviewer Avatar"
                    width={800}
                    height={450}
                    data-ai-hint="3d avatar"
                    className="object-cover w-full h-full"
                    priority
                />
            </div>

            <div className="bg-slate-900 rounded-lg border aspect-video relative flex items-center justify-center text-muted-foreground overflow-hidden">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                {hasCameraPermission === null && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                        <Loader2 className="h-8 w-8 animate-spin mb-2"/>
                        <p>Requesting camera...</p>
                    </div>
                )}
                 {hasCameraPermission === false && (
                    <Alert variant="destructive" className="absolute m-4 w-auto">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>Please allow camera access.</AlertDescription>
                    </Alert>
                )}
                {hasCameraPermission && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 bg-black/30 backdrop-blur-sm p-2 rounded-full text-white">
                           <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-white/20"><PauseCircle /></Button>
                           <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-white/20"><Smile /></Button>
                           <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-white/20"><Eye /></Button>
                        </div>
                        <div className="bg-black/30 backdrop-blur-sm p-2 rounded-full text-white">
                            {isRecording ? (
                                <Mic className="text-red-500 animate-pulse" />
                            ) : (
                                <Mic />
                            )}
                        </div>
                    </div>
                )}
            </div>
          </div>

          <div className="bg-slate-800 text-white p-3 rounded-lg flex items-center gap-3">
              <div className="bg-primary p-1.5 rounded-full flex-shrink-0">
                <Bot className="text-primary-foreground h-5 w-5" />
              </div>
              <p className="font-medium text-sm md:text-base">
                AVA: {isSpeaking ? <span className="animate-pulse">...</span> : question}
              </p>
          </div>
          
           <Button onClick={handleSubmit} className="w-full" disabled={isAnalyzing || isSpeaking}>
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAnalyzing ? 'Analyzing Answer...' : (isRecording ? 'Stop & Submit Answer' : 'Submit Answer')}
            </Button>

        </CardContent>
      </Card>
    </div>
  );
}
