import { getSession } from '@/lib/core/auth';
import { nanoid } from 'nanoid';
import { TransvipPanel } from '@/components/features/chat/panel';
import { ChatSession } from '@/types/domain/chat';

export default async function TransvipChat() {
	const id = nanoid();
	const sessionData = await getSession();
	if (!sessionData) {
		throw new Error("Session not found");
	}
	const session = sessionData as unknown as ChatSession;

	return (
		<div className="h-full flex flex-col gap-4 items-center">
			<TransvipPanel id={id} session={session} />
		</div>
	);
}
