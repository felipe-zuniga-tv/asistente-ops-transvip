import { getSession } from '@/lib/core/auth';
import { nanoid } from 'nanoid';
import { Chat } from '@/components/features/chat/chat';
import { ChatSession } from '@/types/domain/chat';

export default async function TransvipChat() {
	const id = nanoid();
	const sessionData = await getSession();
	const session = sessionData as unknown as ChatSession;

	return (
		<Chat id={id} session={session} />
	);
}
