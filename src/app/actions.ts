
'use server';

import {
  analyzeAnswerQuality as analyzeQuality,
  AnalyzeAnswerQualityInput,
  AnalyzeAnswerQualityOutput,
} from '@/ai/flows/analyze-answer-quality';
import { z } from 'zod';

const answerSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export async function analyzeAnswerQuality(
  input: AnalyzeAnswerQualityInput
): Promise<AnalyzeAnswerQualityOutput> {
  const parsedInput = answerSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new Error('Invalid input for analyzing answer.');
  }
  
  try {
    return await analyzeQuality(parsedInput.data);
  } catch (error) {
    console.error('Error analyzing answer quality:', error);
    throw new Error('Failed to analyze the answer. Please try again.');
  }
}
