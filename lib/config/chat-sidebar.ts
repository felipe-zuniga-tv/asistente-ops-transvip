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
	Ticket,
	Map,
	BarChart4,
	BookPlusIcon,
	BusFront,
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
					url: Routes.CHAT,
					active: true
				},
				{
					title: 'Genera tu código QR',
					icon: QrCodeIcon,
					url: Routes.QR_GEN,
					active: true
				},
				// {
				// 	title: 'Herramientas Aeropuerto',
				// 	icon: PlaneTakeoff,
				// 	url: Routes.AIRPORT.HOME,
				// 	active: true
				// },
				{
					title: 'Análisis de Datos',
					icon: BarChart4,
					url: Routes.DATA.HOME,
					active: true
				},
				{
					title: 'Tickets Aeropuerto',
					icon: Ticket,
					url: Routes.FINANCE.TICKETS,
					active: false
				},
				{
					title: 'Ruteo Reservas',
					icon: Map,
					url: Routes.ROUTE.MAIN,
					active: false
				},
			],
		},
		{
			title: "Reservas",
			url: "#",
			icon: BookPlusIcon,
			isActive: true,
			items: [
				{
					title: 'Compartidas',
					icon: BusFront,
					url: Routes.BOOKINGS.SHARED,
					active: true
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
			url: Routes.FEEDBACK.GOOGLE_FORMS,
			icon: Send,
		},
	]
}