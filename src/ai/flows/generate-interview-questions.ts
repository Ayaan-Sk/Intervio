'use server';

/**
 * @fileOverview AI flow to generate interview questions based on topics.
 *
 * - generateInterviewQuestions - Function to generate questions.
 * - GenerateInterviewQuestionsInput - Input type for the function.
 * - GenerateInterviewQuestionsOutput - Output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuestionsInputSchema = z.object({
  topics: z.array(z.string()).describe('A list of technical topics for the interview.'),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const GenerateInterviewQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of 3 interview questions.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  prompt: `You are an expert technical interviewer.
Generate 3 challenging and relevant interview questions based on the following topics: {{#each topics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
The questions should be suitable for a mid-level software engineer.
Do not repeat questions.
Return the questions in the specified JSON format.`,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    // Add a fallback in case the AI fails to generate questions
    if (!output?.questions || output.questions.length === 0) {
      return { questions: ["Tell me about a challenging technical problem you solved recently.", "Describe your experience with version control systems like Git.", "How do you approach learning a new technology?"] };
    }
    return output!;
  }
);
