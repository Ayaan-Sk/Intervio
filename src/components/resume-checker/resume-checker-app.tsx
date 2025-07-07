'use client';
import { useState } from 'react';
import { ResumeUploadForm } from './resume-upload-form';
import { ResumeAnalysisReport } from './resume-analysis-report';
import { analyzeResume, AnalyzeResumeOutput } from '@/ai/flows/analyze-resume';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function ResumeCheckerApp() {
  const [analysis, setAnalysis] = useState<AnalyzeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = async (resumeDataUri: string, jobDescription: string) => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeResume({ resumeDataUri, jobDescription });
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'There was an error analyzing your resume. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRestart = () => {
    setAnalysis(null);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center w-full max-w-2xl">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-semibold">Analyzing your resume...</h2>
        <p className="text-muted-foreground">This may take a moment. We're comparing your resume against the job description.</p>
      </div>
    );
  }
  
  if (analysis) {
    return <ResumeAnalysisReport result={analysis} onRestart={handleRestart} />;
  }

  return <ResumeUploadForm onSubmit={handleAnalysis} isAnalyzing={isLoading} />;
}
