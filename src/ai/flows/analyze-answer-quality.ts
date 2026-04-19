'use server';

/**
 * @fileOverview AI flow to analyze the quality of a user's answer to an interview question.
 *
 * - analyzeAnswerQuality - Function to analyze the answer.
 * - AnalyzeAnswerQualityInput - Input type for the analyzeAnswerQuality function.
 * - AnalyzeAnswerQualityOutput - Output type for the analyzeAnswerQuality function.
 */

import {z} from 'zod';

const AnalyzeAnswerQualityInputSchema = z.object({
  question: z.string().describe('The interview question asked by the AI.'),
  answer: z.string().describe('The user provided answer to the question.'),
});
export type AnalyzeAnswerQualityInput = z.infer<typeof AnalyzeAnswerQualityInputSchema>;

const AnalyzeAnswerQualityOutputSchema = z.object({
  sentiment: z.string().describe('The overall sentiment of the answer (e.g., positive, negative, neutral).'),
  qualityRating: z.number().describe('A rating of the answer quality on a scale of 1 to 5, with 5 being the highest quality.'),
  talkingPoints: z.array(z.string()).describe('Key talking points extracted from the answer.'),
  justification: z.string().describe("A detailed, conversational justification for the analysis, explaining the rating and referencing talking points.")
});
export type AnalyzeAnswerQualityOutput = z.infer<typeof AnalyzeAnswerQualityOutputSchema>;

export async function analyzeAnswerQuality(input: AnalyzeAnswerQualityInput): Promise<AnalyzeAnswerQualityOutput> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const { question, answer } = input;
  const wordCount = answer.split(/\s+/).length;

  // Simple heuristics for dummy feedback
  let qualityRating = 3;
  let sentiment = 'neutral';
  let justification = "Your answer provides a basic overview of the topic. To improve, try to include more specific examples from your past projects or technical depth regarding the underlying mechanics.";

  if (wordCount > 50) {
    qualityRating = 5;
    sentiment = 'positive';
    justification = "Excellent and detailed response! You've demonstrated a deep understanding of the subject matter, clearly explaining both the 'what' and the 'why'. Your use of structured explanations makes it very easy to follow.";
  } else if (wordCount > 20) {
    qualityRating = 4;
    sentiment = 'positive';
    justification = "Good answer. You've covered the main points effectively. Integrating more industry-standard terminology or briefly mentioning alternative approaches could push this to an expert level.";
  }

  const talkingPoints = [
    "Clear communication style",
    "Conceptual accuracy",
    wordCount > 30 ? "Good depth of detail" : "Concise response"
  ];

  return {
    sentiment,
    qualityRating,
    talkingPoints,
    justification
  };
}
