'use server';
/**
 * @fileOverview Deterministic flow to analyze a resume against a job description.
 *
 * - analyzeResume - Function to return dummy resume analysis.
 * - AnalyzeResumeInput - Input type for the function.
 * - AnalyzeResumeOutput - Output type for the function.
 */

import { z } from 'zod';

const AnalyzeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A PDF resume, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  jobDescription: z.string().describe('The full text of the job description to compare the resume against.'),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  atsScore: z.number().int().min(0).max(100),
  summary: z.string(),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  suggestions: z.array(z.string()),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;


export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { jobDescription } = input;
  
  // Generic but realistic dummy data
  const atsScore = Math.floor(Math.random() * (92 - 78 + 1)) + 78; // 78-92 range
  
  const matchedKeywords = [
    "TypeScript", "React", "Next.js", "JavaScript", "Responsive Design"
  ];
  
  const missingKeywords = [
    "AWS", "CI/CD", "Unit Testing", "Docker", "GraphQL"
  ];

  return {
    atsScore,
    summary: `Your resume shows a strong alignment with the core frontend requirements of this role, particularly in modern web technologies.`,
    matchedKeywords,
    missingKeywords,
    suggestions: [
      "Quantify your impact in your professional experience section using more specific metrics (e.g., 'Improved performance by 20%').",
      "Include a dedicated 'Technical Skills' section that highlights your experience with cloud platforms like AWS or Docker.",
      "Ensure your contact information is clearly visible at the very top of the document for easier parser extraction.",
      "Add a brief professional summary that highlights your key career achievements and transitions."
    ]
  };
}
