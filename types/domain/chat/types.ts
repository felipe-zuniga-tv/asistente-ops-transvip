import { Message } from 'ai';
import type { User } from '@/types/core/auth'; // For ChatSession
import type React from 'react'; // Added for React.ReactNode

export interface StreamChatOptions {
  model: string;
  messages: Message[];
  id: string;
  user: any; // Consider defining a more specific user type if possible
}

// From types/domain/chat/models.ts
export interface ChatSession {
    user: User;
}

export interface ChatProps {
    id: string;
    initialMessages?: any[]; // Consider a more specific type than any[]
    className?: string;
    session: ChatSession;
}

// From lib/features/chat/actions.tsx (specific to Vercel AI SDK state)
export type ChatActionMessage = {
	role: "user" | "assistant" | "system" | "function" | "data" | "tool";
	content: string;
	id?: string;
	name?: string;
	display?: {
		name: string;
		props: Record<string, any>; // Consider a more specific type for props if possible
	};
};

// Adjusted AIState to use ChatActionMessage
export type AIState = {
	chatId: string;
	interactions?: string[];
	messages: ChatActionMessage[];
};

export type UIState = {
	id: string;
	display: React.ReactNode; // Needs React import if not already present
	spinner?: React.ReactNode;
	attachments?: React.ReactNode;
}[];

// Ensure Message is imported if it's from 'ai' or defined elsewhere
// import type { Message } from 'ai'; // Example if Message is from 'ai'
// import type React from 'react'; // If React.ReactNode is used

// export {}; // Removed as file is no longer empty 