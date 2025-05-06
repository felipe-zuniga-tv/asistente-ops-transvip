import { getSession } from '@/lib/core/auth';
import { nanoid } from 'nanoid';
import { Chat } from '@/components/features/chat/chat';
import { ChatSession } from '@/types/domain/chat';

export default async function TransvipChat() {
	const id = nanoid();
	const sessionData = await getSession();
	const session = sessionData as unknown as ChatSession;

	return (
		<div className="h-full flex flex-col gap-4 items-center">
			<div className="border flex h-full w-full min-h-[50vh] flex-col rounded-xl bg-muted/50 max-w-4xl mx-auto p-2 md:p-3">
				<Chat id={id} session={session} />
			</div>
		</div>
	);
}
