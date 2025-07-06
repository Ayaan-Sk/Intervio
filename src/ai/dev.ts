
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-answer-quality.ts';
import '@/ai/flows/generate-interview-questions.ts';
// Text to speech is now handled by the browser's Web Speech API.
// import '@/ai/flows/text-to-speech.ts';
