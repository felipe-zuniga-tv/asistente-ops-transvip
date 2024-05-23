import {
	SettingsIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TransvipLogo } from "../../transvip/transvip-logo"
import LogoutButton from "../../auth/logout"
import SidebarOptions from "./aside"
import UserDetails from "@/components/ui/navigation/user-details"
import { TransvipOpsChat } from "../chat"
import SystemTools from "./tools"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

export function TransvipPanel({ id, session }) {
	return (
		<div className="grid h-screen w-full xs:pl-[56px] bg-white">
			<SidebarOptions className="" />
			<div className="flex flex-col">
				<header className="sticky top-0 z-10 flex h-[56px] items-center gap-1 border-b_ bg-background px-4">
					<div className="flex flex-row gap-2 text-xl font-semibold mr-4">
						<span>Operaciones</span>
						<Badge variant={"default"} className="bg-transvip">
							<TransvipLogo colored={false} className="py-1" size={60} />
						</Badge>
					</div>
					<Drawer>
						<DrawerTrigger asChild>
							<Button variant="outline" size="icon" className="md:hidden bg-slate-800">
								<SettingsIcon className="size-4 text-white" />
								<span className="sr-only">Herramientas</span>
							</Button>
						</DrawerTrigger>
						<DrawerContent className="max-h-[80vh]">
							<DrawerHeader>
								<DrawerTitle><span>Herramientas</span></DrawerTitle>
							</DrawerHeader>
							<div className="grid w-full items-start gap-4 border p-4 rounded-xl">
								<SystemTools session={session} />
							</div>
						</DrawerContent>
					</Drawer>
					<div className="ml-auto flex gap-4 items-center">
						<UserDetails session={session} />
						<LogoutButton className="ml-auto" />
					</div>
				</header>
				<main className="grid flex-1 gap-4 overflow-auto p-0 md:p-4 md:grid-cols-[1fr_4fr]">
					<div className="relative hidden flex-col items-start gap-8 md:flex min-w-[360px]">
						<div className="grid w-full items-start gap-4 border p-4 rounded-xl">
							<SystemTools session={session} />
						</div>
					</div>
					<div className="relative border flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2_">
						<TransvipOpsChat id={id} session={session} />
					</div>
				</main>
			</div>
		</div>
	)
}
