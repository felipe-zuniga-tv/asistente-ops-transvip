"use client"

import * as React from "react"
import {
	BarChart3,
	BookOpen,
	BotIcon,
	Drill,
	GanttChart,
	Hammer,
	LucideIcon,
	PlaneTakeoff,
	QrCodeIcon,
	Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"
import { opsTeams } from "@/lib/transvip/config"
import { toolsList } from "@/lib/chat/config"
import { useActions, useUIState } from "ai/rsc"
import { nanoid } from "@/lib/utils"
import { UserMessage } from "../message"
import { Tool } from "@/lib/chat/types"
import { Routes } from "@/utils/routes"


// Define a new interface for sidebar items
export interface SidebarItem {
	title: string;
	url: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: Tool[]; // Recursive type for nested items
}

// Sidebar content
const sidebarData : { navMain: SidebarItem[] } = {
	navMain: [
		{
			title: "Secciones",
			url: "#",
			icon: Hammer,
			isActive: true,
			items: [
				{
					title: 'Genera tu código QR',
					icon: QrCodeIcon,
					url: Routes.QR_GEN
				},
				{
					title: 'Herramientas Aeropuerto',
					icon: PlaneTakeoff,
					url: Routes.AIRPORT.HOME
				},
			],
		},
		{
			title: "Herramientas Jarvip",
			url: "#",
			icon: Drill,
			isActive: true,
			items: toolsList,
		},
		{
			title: "Reportes",
			url: "#",
			icon: BarChart3,
			items: [
				{
					title: "Cumplimiento",
					url: "#",
				},
				{
					title: "Cumplimiento 2024",
					url: "#",
				},
			],
		},
		{
			title: "Documentación",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Introduction",
					url: "#",
				},
				{
					title: "Get Started",
					url: "#",
				},
				{
					title: "Tutorials",
					url: "#",
				},
				{
					title: "Changelog",
					url: "#",
				},
			],
		},
		{
			title: "Configuración",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Team",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
				},
			],
		},
		{
			title: "Proyectos",
			url: "#",
			icon: GanttChart,
			items: [
				{
					title: "Proyecto Zarpe",
					url: "#",
					icon: PlaneTakeoff,
				},
				{
					title: "Autoasignación",
					url: "#",
					icon: BotIcon,
				},
			],
		},
	],
}

export function AppSidebar({ session, ...props }: { session: any & React.ComponentProps<typeof Sidebar> }) {
	const [_, setMessages] = useUIState()
	const { submitUserMessage } = useActions()

	const handleClick = async (tool: any) => {
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

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={opsTeams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={sidebarData.navMain} handleClick={handleClick} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={session.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}


