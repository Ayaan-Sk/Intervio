
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StarRating } from '@/components/voice-mockup/star-rating';
import { CheckCircle2 } from 'lucide-react';

interface AnalysisResult {
  sentiment: string;
  qualityRating: number;
  talkingPoints: string[];
  justification: string;
  answer: string;
}

interface FeedbackCardProps {
  result: AnalysisResult;
}

export function FeedbackCard({ result }: FeedbackCardProps) {
  const sentimentVariant = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'default';
      case 'negative':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="font-headline">Feedback</CardTitle>
        <CardDescription>Here's the analysis of your answer.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Your Answer</h3>
          <p className="text-muted-foreground p-4 bg-muted/50 rounded-md border">{result.answer}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Quality Rating</h3>
                <StarRating rating={result.qualityRating} />
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Sentiment</h3>
                <Badge variant={sentimentVariant(result.sentiment)} className="capitalize w-fit">{result.sentiment}</Badge>
            </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-semibold mb-2">Justification</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{result.justification}</p>
        </div>

        <Separator />
        
        <div>
          <h3 className="font-semibold mb-4">Key Talking Points</h3>
          <ul className="space-y-2">
            {result.talkingPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
