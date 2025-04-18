'use server';

import { Message } from 'ai';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

// Import the SYSTEM_MESSAGE from config
import { SYSTEM_MESSAGE } from '@/lib/core/config/chat';

// Initialize the Google AI client
// const GOOGLE_MODEL_NAME_DEFAULT = 'gemini-2.0-flash';
const GOOGLE_MODEL_NAME_DEFAULT = 'gemini-2.5-flash-preview-04-17';

export interface StreamChatOptions {
  model: string;
  messages: Message[];
  id: string;
  user: any;
}

export async function streamChat({ model, messages, id, user }: StreamChatOptions) {
  try {
    // Use the model from the request or default to GOOGLE_MODEL_NAME_DEFAULT
    const modelName = model || GOOGLE_MODEL_NAME_DEFAULT;
    const modelInstance = google(modelName);

    // Generate text using Google's Gemini model
    const { text } = await generateText({
      model: modelInstance,
      system: SYSTEM_MESSAGE,
      messages: [...messages],
    });

    // Return the response
    return { value: text, done: true };
  } catch (error) {
    console.error('Error in AI provider:', error);
    return { error, value: null, done: true };
  }
} 