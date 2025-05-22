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
		<div className="h-full flex flex-col gap-4 items-center">
			<div className="border flex h-full w-full min-h-[50vh] flex-col rounded-xl bg-muted/50 max-w-7xl mx-auto p-2 md:p-3">
				<Chat id={id} session={session} />
			</div>
		</div>
	);
}
