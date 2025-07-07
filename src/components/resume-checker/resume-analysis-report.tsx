'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { AnalyzeResumeOutput } from '@/ai/flows/analyze-resume';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

interface ReportProps {
  result: AnalyzeResumeOutput;
  onRestart: () => void;
}

export function ResumeAnalysisReport({ result, onRestart }: ReportProps) {
  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-green-500';
    if (score > 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="w-full max-w-3xl animate-fade-in-up">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Resume Analysis Report</CardTitle>
        <CardDescription>Here's how your resume stacks up against the job description.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold">Overall Match Score</h3>
            <div className="relative h-32 w-32 mx-auto">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                    <path
                        className="text-muted/20"
                        stroke="currentColor"
                        strokeWidth="3.8"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        className={getScoreColor(result.atsScore)}
                        stroke="currentColor"
                        strokeWidth="3.8"
                        strokeDasharray={`${result.atsScore}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">{result.atsScore}</span>
                    <span className="text-lg font-medium text-muted-foreground">%</span>
                </div>
            </div>
            <p className="text-muted-foreground">{result.summary}</p>
        </div>

        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle2 className="text-green-500" /> Matched Keywords</h3>
                {result.matchedKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {result.matchedKeywords.map(kw => <Badge key={kw} variant="secondary">{kw}</Badge>)}
                    </div>
                ) : <p className="text-muted-foreground text-sm">No strong keyword matches found.</p>}
            </div>
            <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2"><XCircle className="text-red-500" /> Missing Keywords</h3>
                {result.missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {result.missingKeywords.map(kw => <Badge key={kw} variant="destructive">{kw}</Badge>)}
                    </div>
                ) : <p className="text-muted-foreground text-sm">Great job! No critical keywords seem to be missing.</p>}
            </div>
        </div>

        <Separator />

        <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Lightbulb className="text-yellow-500" /> Actionable Suggestions</h3>
            <ul className="space-y-3 list-disc pl-5 text-muted-foreground">
                {result.suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}
            </ul>
        </div>
        
        <Button onClick={onRestart} className="w-full mt-6">
          Analyze Another Resume
        </Button>
      </CardContent>
    </Card>
  );
}
