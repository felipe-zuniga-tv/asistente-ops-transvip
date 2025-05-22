import { getSession } from '@/lib/core/auth';
import { nanoid } from 'nanoid';
import { Chat } from '@/components/features/chat/chat';
import { ChatSession } from '@/types/domain/chat';
import { redirect } from 'next/navigation';
import { Routes } from '@/utils/routes';

export default async function TransvipChat() {
	const id = nanoid();
	const sessionData = await getSession();
	const session = sessionData as unknown as ChatSession;

	if (!session) {
		redirect(Routes.LOGIN);
	}

	return (
		<Chat id={id} session={session} />
	);
}
