import { Tool } from "@/lib/chat/types";
import { Routes } from "@/utils/routes";
import {
	BarChart3,
	BotIcon,
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
	MapIcon,
	BotMessageSquare,
	PieChart,
	MapPin,
	Pencil,
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
	title: "Chatbot Operaciones",
	url: "#",
	icon: Bot,
	isActive: false,
	items: toolsList,
}

export const sidebarData: { navMain: SidebarItem[], navSecondary: SidebarItem[] } = {
	navMain: [
		chatbotItem,
		{
			title: "Herramientas",
			url: "#",
			icon: Hammer,
			isActive: false,
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
					title: 'Coordenadas GeoJSON',
					icon: Map,
					url: Routes.DATA.GEOFENCES,
					active: true
				},
				{
					title: 'Escribe un texto',
					icon: Pencil,
					url: Routes.TEXT.WRITE,
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
					icon: MapPin,
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
		// {
		// 	title: "Reportes",
		// 	url: "#",
		// 	icon: PieChart,
		// 	items: [
		// 		{
		// 			title: "Cumplimiento",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Cumplimiento 2024",
		// 			url: "#",
		// 		},
		// 	],
		// },
		// {
		// 	title: "Proyectos",
		// 	url: "#",
		// 	icon: GanttChart,
		// 	items: [
		// 		{
		// 			title: "Proyecto Zarpe",
		// 			url: "#",
		// 			icon: PlaneTakeoff,
		// 		},
		// 		{
		// 			title: "Autoasignación",
		// 			url: "#",
		// 			icon: BotIcon,
		// 		},
		// 	],
		// },
	],
	navSecondary: [
		{
			title: "Feedback",
			url: Routes.FEEDBACK.GOOGLE_FORMS,
			icon: Send,
		},
	]
}