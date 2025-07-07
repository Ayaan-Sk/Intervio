'use server';
/**
 * @fileOverview AI flow to analyze a resume against a job description.
 *
 * - analyzeResume - Function to trigger the resume analysis.
 * - AnalyzeResumeInput - Input type for the function.
 * - AnalyzeResumeOutput - Output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A PDF resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
  jobDescription: z.string().describe('The full text of the job description to compare the resume against.'),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  atsScore: z.number().int().min(0).max(100).describe('An overall match score from 0 to 100, representing how well the resume matches the job description for an ATS.'),
  summary: z.string().describe('A brief, one-sentence summary of the match quality.'),
  matchedKeywords: z.array(z.string()).describe('A list of important keywords from the job description that were found in the resume.'),
  missingKeywords: z.array(z.string()).describe('A list of important keywords from the job description that were NOT found in the resume.'),
  suggestions: z.array(z.string()).describe('A list of specific, actionable suggestions for how the candidate can improve their resume for this specific job.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;


export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeAnalyzerPrompt',
  input: { schema: AnalyzeResumeInputSchema },
  output: { schema: AnalyzeResumeOutputSchema },
  prompt: `You are an expert ATS (Applicant Tracking System) and professional resume reviewer. Your task is to analyze the provided resume against the given job description and provide a detailed analysis.

Job Description:
---
{{{jobDescription}}}
---

Candidate's Resume:
{{media url=resumeDataUri}}

Analyze the resume based on the job description and perform the following actions:
1.  **Calculate an ATS Score**: Give a score from 0-100 indicating the resume's compatibility with the job description. A higher score means a better match. Base this on skills, experience, and keyword alignment.
2.  **Write a Summary**: Provide a single, concise sentence summarizing the overall fit.
3.  **Identify Matched Keywords**: Extract a list of the most critical keywords and skills from the job description that are present in the resume.
4.  **Identify Missing Keywords**: Extract a list of the most critical keywords and skills from the job description that are missing from the resume. This is very important.
5.  **Provide Actionable Suggestions**: Give a list of concrete, actionable suggestions for the candidate to improve their resume to be a better fit for THIS specific job. Suggestions should be specific, e.g., "Quantify your achievement in the X project by adding metrics like..." or "Consider adding the term 'CI/CD' as you described a similar process but did not use the keyword."

Provide the output in the specified JSON format.`,
});

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
