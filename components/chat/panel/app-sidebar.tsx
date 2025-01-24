"use client"

import * as React from "react"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
// import { TeamSwitcher } from "@/components/team-switcher"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"
// import { opsTeams } from "@/lib/transvip/config"
import { useActions, useUIState } from "ai/rsc"
import { nanoid } from "@/lib/utils"
import { UserMessage } from "../message"
import { Routes } from "@/utils/routes"
import { usePathname, useRouter } from "next/navigation"
import { sidebarData, chatbotItem } from "@/lib/config/chat-sidebar"
import { Bot, BotMessageSquare } from "lucide-react"

// Hints for chatbot functionalities
const showHints = false

export function AppSidebar({ session, ...props }: { session: any & React.ComponentProps<typeof Sidebar> }) {
	const [_, setMessages] = useUIState()
	const { submitUserMessage } = useActions()
	const router = useRouter()
	const path = usePathname()
	const isChatRoute = path === Routes.CHAT

	const handleClick = async (tool: any) => {
		if (tool.title === chatbotItem.title) {
			router.push(Routes.CHAT)
			return
		}

		const userMessageContent = `${tool.search}`.trim()

		setMessages((currentMessages: any[]) => [
			...currentMessages,
			{
				id: nanoid(),
				display: <UserMessage content={userMessageContent} session={session} />
			}
		])

		const response = await submitUserMessage(userMessageContent)
		setMessages((currentMessages: any[]) => [
			...currentMessages,
			response
		])
	}

	const sidebarItems = isChatRoute 
		? sidebarData.navMain 
		: [{
			title: chatbotItem.title,
			url: "#",
			icon: chatbotItem.icon,
			active: true,
			items: [
				{
					title: "Accede a Jarvip",
					url: Routes.CHAT,
					icon: BotMessageSquare,
					active: true
				}
			]

		}, ...sidebarData.navMain.filter(item => item.title !== chatbotItem.title)]

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				{/* <TeamSwitcher teams={opsTeams} /> */}
				<NavUser user={session.user} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={sidebarItems} handleClick={handleClick} showHints={showHints} />
			</SidebarContent>
			<SidebarFooter>
				<NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}


