import { getSession } from '@/lib/auth';
import { nanoid } from 'nanoid';
import { TransvipPanel } from '@/components/chat-new/panel';

export default async function TransvipChat() {
	const id = nanoid();
	const session = await getSession();

	return (
		<div className="h-full flex flex-col gap-4 items-center">
			<TransvipPanel id={id} session={session} />
		</div>
	);
}
