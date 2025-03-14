import { AppSidebar } from "@/components/chat/panel/app-sidebar";
import Header from "@/components/ui/header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getSession } from "@/lib/core/auth";
import { AI } from "@/lib/services/chat/actions";
import { ChatSession } from '@/lib/core/types/chat'
import { nanoid } from "@/lib/utils";
import { Routes } from "@/utils/routes";
import { redirect } from "next/navigation";

export default async function ChatAppLayout({ children }: { children: React.ReactNode }) {
	const session = await getSession() as ChatSession | null;

	if (!session) {
		return redirect(Routes.LOGIN);
	}

	const id = nanoid()

	return (
		<AI initialAIState={{ chatId: id, interactions: [], messages: [] }}>
			<SidebarProvider>
				<AppSidebar session={session} />
				<div className="grid h-screen w-full bg-white">
					<div className="flex flex-col">
						<Header>
							<SidebarTrigger />
						</Header>
						<div className="flex-1 overflow-auto py-3 pt-0 px-2 md:px-4">
							{children}
						</div>
					</div>
				</div>
			</SidebarProvider>
		</AI>
	)
}
