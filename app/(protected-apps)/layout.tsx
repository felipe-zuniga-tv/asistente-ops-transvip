import { AppSidebar } from "@/components/chat/panel/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth";
import { AI } from "@/lib/chat/actions";
import { Session } from "@/lib/chat/types";
import { nanoid } from "@/lib/utils";
import { Routes } from "@/utils/routes";
import { redirect } from "next/navigation";

export default async function ProtectedAppsLayout({ children }: { children: React.ReactNode }) {
	const session = await getSession() as unknown;
	const accessToken = (session as Session)?.user?.accessToken || null;

	console.log(session)
	console.log(accessToken)

	if (!accessToken) {
		return redirect(Routes.LOGIN);
	}

	const id = nanoid()

	return (
		<AI initialAIState={{ chatId: id, interactions: [], messages: [] }}>
			<SidebarProvider>
				<AppSidebar session={session} />
				<div className="flex min-h-screen w-full flex-col bg-transparent overflow-auto">
					<SidebarTrigger />
					{children}
				</div>
			</SidebarProvider>
		</AI>

	)
}
