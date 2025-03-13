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
import { sidebarData, chatbotMenu, publicSidebar } from "@/lib/core/config/chat-sidebar"
import { BotMessageSquare } from "lucide-react"

// Hints for chatbot functionalities
const showHints = false

// Chatbot element for sidebar
const chatbotElement = {
	title: chatbotMenu.title,
	url: "#",
	icon: chatbotMenu.icon,
	active: true,
	items: [
		{
			title: "Accede a Jarvip",
			url: Routes.CHAT,
			icon: BotMessageSquare,
			active: true
		}
	]
}

export function AppSidebar({ session, ...props }: { session: any & React.ComponentProps<typeof Sidebar> }) {
	const [_, setMessages] = useUIState()
	const { submitUserMessage } = useActions()
	const router = useRouter()
	const path = usePathname()
	const isChatRoute = path === Routes.CHAT

	const handleClick = async (tool: any) => {
		if (tool.title === chatbotMenu.title) {
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
		: [publicSidebar, chatbotElement, ...sidebarData.navMain.filter(item => item.title !== chatbotMenu.title && item.title !== publicSidebar.title)]

	// sidebarItems = session.user.email === 'felipe.zuniga@transvip.cl' ? sidebarItems : sidebarItems.filter(item => item.title !== "Configuración")

	return (
		<Sidebar collapsible="icon" {...props}>
				<SidebarContent>
					<NavMain items={sidebarItems} handleClick={handleClick} showHints={showHints} />
				</SidebarContent>
				<SidebarFooter>
					<NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
					<NavUser user={session.user} />
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
	)
}


