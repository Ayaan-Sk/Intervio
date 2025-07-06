'use server';

/**
 * @fileOverview AI flow to analyze the quality of a user's answer to an interview question.
 *
 * - analyzeAnswerQuality - Function to analyze the answer.
 * - AnalyzeAnswerQualityInput - Input type for the analyzeAnswerQuality function.
 * - AnalyzeAnswerQualityOutput - Output type for the analyzeAnswerQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  return analyzeAnswerQualityFlow(input);
}

const analyzeAnswerQualityPrompt = ai.definePrompt({
  name: 'analyzeAnswerQualityPrompt',
  input: {schema: AnalyzeAnswerQualityInputSchema},
  output: {schema: AnalyzeAnswerQualityOutputSchema},
  prompt: `You are an expert interview analyst. Analyze the candidate's answer to the following question.

Question: {{{question}}}
Answer: {{{answer}}}

Determine the sentiment of the answer, rate the quality of the answer on a scale of 1 to 5 (where 5 is excellent), and extract the key talking points.
Then, provide a detailed, conversational justification for this analysis. Explain why you gave the rating you did, referencing the talking points and the candidate's answer. Speak directly to the candidate.

Output in JSON format:
${JSON.stringify(AnalyzeAnswerQualityOutputSchema.shape, null, 2)}`,
});

const analyzeAnswerQualityFlow = ai.defineFlow(
  {
    name: 'analyzeAnswerQualityFlow',
    inputSchema: AnalyzeAnswerQualityInputSchema,
    outputSchema: AnalyzeAnswerQualityOutputSchema,
  },
  async input => {
    const {output} = await analyzeAnswerQualityPrompt(input);
    return output!;
  }
);
