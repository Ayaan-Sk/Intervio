
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { StarRating } from './star-rating';
import { FeedbackCard } from './feedback-card';
import { Separator } from '../ui/separator';

interface AnalysisResult {
  sentiment: string;
  qualityRating: number;
  talkingPoints: string[];
  justification: string;
  answer: string;
}

interface InterviewSummaryProps {
  results: AnalysisResult[];
  questions: string[];
  onRestart: () => void;
}

export function InterviewSummary({ results, questions, onRestart }: InterviewSummaryProps) {
  const averageRating = results.reduce((acc, result) => acc + result.qualityRating, 0) / results.length;

  return (
    <Card className="w-full max-w-3xl animate-fade-in-up">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Interview Complete!</CardTitle>
        <CardDescription>Here is a summary of your performance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted rounded-lg border">
          <h3 className="font-semibold mb-2 text-center">Average Score</h3>
          <div className="flex justify-center">
            <StarRating rating={averageRating} />
          </div>
          <p className="text-center text-muted-foreground mt-1">{averageRating.toFixed(1)} / 5.0</p>
        </div>
        
        <Separator />

        <h3 className="font-semibold">Detailed Feedback</h3>
        <Accordion type="single" collapsible className="w-full">
          {results.map((result, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="truncate flex-1 text-left">{`Question ${index + 1}: ${questions[index]}`}</span>
                  <StarRating rating={result.qualityRating} className="ml-4 shrink-0" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <FeedbackCard result={result} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Button onClick={onRestart} className="w-full mt-6">
          Start New Interview
        </Button>
      </CardContent>
    </Card>
  );
}
