'use client';

import { Chat } from './chat';
import { Message } from 'ai';
import { ChatSession } from '@/types/domain/chat';

export interface TransvipPanelProps {
	id: string;
	session: ChatSession;
}

export function TransvipPanel({ id, session }: TransvipPanelProps) {
	const initialMessages: Message[] = [];

	return (
		<div className="border flex h-full w-full min-h-[80vh] flex-col rounded-xl bg-muted/50 max-w-4xl mx-auto p-2 md:p-3">
			<Chat
				id={id}
				initialMessages={initialMessages}
				session={session}
			/>
		</div>
	);
} 