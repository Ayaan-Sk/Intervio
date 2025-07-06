
'use server';

import {
  analyzeAnswerQuality as analyzeQuality,
  AnalyzeAnswerQualityInput,
  AnalyzeAnswerQualityOutput,
} from '@/ai/flows/analyze-answer-quality';
import {
  textToSpeech as genkitTextToSpeech,
  TextToSpeechInput,
} from '@/ai/flows/text-to-speech';
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

const ttsSchema = z.object({
  text: z.string(),
  voice: z.enum(['male', 'female']),
});

export async function textToSpeech(
  input: TextToSpeechInput
): Promise<{ audioDataUri?: string; error?: string }> {
  const parsedInput = ttsSchema.safeParse(input);
  if (!parsedInput.success) {
    return { error: 'Invalid input for text-to-speech.' };
  }
  
  try {
    const result = await genkitTextToSpeech(parsedInput.data);
    return { audioDataUri: result.audioDataUri };
  } catch (error) {
    console.error('Error in text to speech:', error);
    if (error instanceof Error) {
        if (error.message.includes('429')) {
          return { error: 'API rate limit exceeded. Please try again later or check your billing plan.' };
        }
        return { error: error.message };
    }
    return { error: 'Failed to generate audio due to an unknown error.' };
  }
}
