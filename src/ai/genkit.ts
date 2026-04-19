/**
 * Genkit initialization is currently disabled to prevent build errors and remove Gemini API dependency.
 */

// import {genkit} from 'genkit';
// import {googleAI} from '@genkit-ai/googleai';

export const ai = {
  // Mocking the ai object to satisfy any remaining references if they exist
  generateStream: async () => ({ stream: null }),
  definePrompt: (config: any) => () => ({ output: null }),
  defineFlow: (config: any, fn: any) => fn,
};
