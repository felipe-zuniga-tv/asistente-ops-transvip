import { Tool } from "@/lib/chat/types";
import { Routes } from "@/utils/routes";
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
	Send,
	Bot,
} from "lucide-react"
import { toolsList } from "./tools";

// Define a new interface for sidebar items
export interface SidebarItem {
	title: string;
	url: string;
	icon: LucideIcon;
	isActive?: boolean;
	items?: Tool[]; // Recursive type for nested items
}

// Sidebar content
export const chatbotItem : SidebarItem = {
	title: "Herramientas Jarvip",
	url: "#",
	icon: Drill,
	isActive: true,
	items: toolsList,
}

export const sidebarData: { navMain: SidebarItem[], navSecondary: SidebarItem[] } = {
	navMain: [
		{
			title: "Secciones",
			url: "#",
			icon: Hammer,
			isActive: true,
			items: [
				{
					title: 'Chatbot Operaciones',
					icon: Bot,
					url: Routes.CHAT
				},
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
		chatbotItem,
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
		//{
		//	title: "Documentación",
		//	url: "#",
		//	icon: BookOpen,
		//	items: [
		//		{
		//			title: "Introduction",
		//			url: "#",
		//		},
		//		{
		//			title: "Get Started",
		//			url: "#",
		//		},
		//		{
		//			title: "Tutorials",
		//			url: "#",
		//		},
		//		{
		//			title: "Changelog",
		//			url: "#",
		//		},
		//	],
		//},
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
	navSecondary: [
		{
			title: "Feedback",
			url: "#",
			icon: Send,
		},
	]
}