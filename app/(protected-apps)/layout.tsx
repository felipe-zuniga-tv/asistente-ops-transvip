import LogoutButton from "@/components/auth/logout";
import { AppSidebar } from "@/components/chat/panel/app-sidebar";
import Header from "@/components/ui/navigation/header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth";
import { AI } from "@/lib/chat/actions";
import { Session } from "@/lib/chat/types";
import { nanoid } from "@/lib/utils";
import { Routes } from "@/utils/routes";
import { redirect } from "next/navigation";

export default async function ProtectedAppsLayout({ children }: { children: React.ReactNode }) {
	const session = await getSession() as Session | null;

	if (!session) {
		return redirect(Routes.LOGIN);
	}

	const id = nanoid()

	return (
		<AI initialAIState={{ chatId: id, interactions: [], messages: [] }}>
			<SidebarProvider>
				<AppSidebar session={session} />
				<div className="grid h-screen size-full bg-white">
					<div className="flex flex-col">
						<Header>
							<SidebarTrigger />
						</Header>
						<div className="flex-1 overflow-auto p-0 md:p-3 md:pt-0">
							{children}
						</div>
					</div>
				</div>
			</SidebarProvider>
		</AI>

	)
}
