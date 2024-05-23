// import SidebarList from "@/components/ui/side-list";
import { AI } from "@/lib/chat/actions";
import { nanoid } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { TransvipPanel } from "@/components/chat/panel/panel";

export const metadata = {
	title: 'Transvip - Tu asistente'
}

export default async function TransvipChat() {
	const id = nanoid()
	const session = await getSession()

	return (
		<div className="min-h-screen flex flex-col gap-4 items-center">
			<AI initialAIState={{ chatId: id, interactions: [], messages: [] }}>
				<TransvipPanel id={id} session={session} />
			</AI>
		</div>
	);
}
