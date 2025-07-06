
'use server';

import {
  generateInterviewQuestions as generateQuestions,
  GenerateInterviewQuestionsInput,
  GenerateInterviewQuestionsOutput,
} from '@/ai/flows/generate-interview-questions';
import {
  analyzeAnswerQuality as analyzeQuality,
  AnalyzeAnswerQualityInput,
  AnalyzeAnswerQualityOutput,
} from '@/ai/flows/analyze-answer-quality';
import { z } from 'zod';

const topicSchema = z.object({
  technicalTopic: z.string().min(2).max(100),
});

const answerSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export async function generateInterviewQuestions(
  input: GenerateInterviewQuestionsInput
): Promise<GenerateInterviewQuestionsOutput> {
  const parsedInput = topicSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new Error('Invalid input for generating questions.');
  }

  try {
    const result = await generateQuestions(parsedInput.data);
    if (!result || !result.questions || result.questions.length === 0) {
      return { questions: ['Could not generate questions for this topic. Please try another one.'] };
    }
    return result;
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return { questions: ['An unexpected error occurred. Please try again later.'] };
  }
}

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
