'use server';

import { analyzeAnswerQuality } from '@/ai/flows/analyze-answer-quality';
import { ai } from '@/ai/genkit';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const analysisRequestSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { question, answer } = analysisRequestSchema.parse(await req.json());

    // 1. Get the structured analysis first (non-streaming)
    const staticAnalysis = await analyzeAnswerQuality({ question, answer });

    // 2. Create a prompt to generate the streaming justification
    const justificationPrompt = `
      You are an expert interview analyst. You have analyzed a candidate's answer to a question.
      Your analysis produced the following data:
      - Question: "${question}"
      - Candidate's Answer: "${answer}"
      - Quality Rating: ${staticAnalysis.qualityRating} out of 5
      - Sentiment: ${staticAnalysis.sentiment}
      - Key Talking Points: ${staticAnalysis.talkingPoints.join(', ')}

      Now, provide a detailed, conversational justification for this analysis. Explain why you gave the rating you did, referencing the talking points and the candidate's answer. Speak directly to the candidate.
    `;

    // 3. Generate the streaming justification
    const { stream } = await ai.generateStream({
      prompt: justificationPrompt,
      model: 'googleai/gemini-2.0-flash',
    });

    // 4. Combine static data and streaming justification into one response stream
    const customReadable = new ReadableStream({
      async start(controller) {
        // First, send the static analysis as a JSON string chunk
        const staticAnalysisJson = JSON.stringify(staticAnalysis);
        controller.enqueue(new TextEncoder().encode(staticAnalysisJson + '\n---\n'));

        // Then, pipe the justification stream
        const reader = stream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(new TextEncoder().encode(value.text));
          }
        } catch (error) {
          console.error('Error reading justification stream:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(customReadable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Error in analysis route:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze answer.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
