'use server';

import { Message } from 'ai';
import { getSession } from '@/lib/core/auth';
import { streamChat } from '@/lib/services/ai';

// Fixed model that will be used for all chat requests
const MODEL_NAME = 'gemini-2.0-flash-exp';

export async function POST(request: Request) {
	const { id, messages }: { id: string; messages: Array<Message>; } = await request.json();

	const session = await getSession();

	if (!session || !session.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		// Create a streaming response using AI SDK with the fixed model
		const { value, error } = await streamChat({
			model: MODEL_NAME,
			messages,
			id,
			user: session.user,
		});

		if (error) {
			return new Response(JSON.stringify({ error: 'Error generating response' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(value);
	} catch (err) {
		console.error('Error in chat API route:', err);
		return new Response(JSON.stringify({ error: 'An error occurred' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
} 