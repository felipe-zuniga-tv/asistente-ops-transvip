import { nanoid } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { TransvipPanel } from "@/components/chat/panel/panel";

export default async function TransvipChat() {
	const id = nanoid()
	const session = await getSession()

	return (
		<div className="h-full flex flex-col gap-4 items-center">
			<TransvipPanel id={id} session={session} />
		</div>
	);
}
