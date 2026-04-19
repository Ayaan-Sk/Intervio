'use server';

import { analyzeAnswerQuality } from '@/ai/flows/analyze-answer-quality';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const analysisRequestSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

/**
 * Deterministic analysis route.
 * Returns the final analysis object directly without streaming.
 */
export async function POST(req: NextRequest) {
  try {
    const { question, answer } = analysisRequestSchema.parse(await req.json());

    // Get the structured dummy analysis
    const staticAnalysis = await analyzeAnswerQuality({ question, answer });

    // Return the analysis directly as JSON
    return new Response(JSON.stringify(staticAnalysis), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (error) {
    console.error('Error in analysis route:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze answer.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
