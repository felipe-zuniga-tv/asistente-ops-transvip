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
	Car,
	TowerControl,
	Calendar,
	CarFront,
	CalendarClock,
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
			title: "Control de Flota",
			url: "#",
			icon: TowerControl,
			isActive: true,
			items: [
				{
					title: 'Definición de Turnos',
					icon: CalendarClock,
					url: Routes.CONTROL_FLOTA.SHIFTS,
					active: true
				},
				{
					title: 'Turno por Móvil',
					icon: CarFront,
					url: Routes.CONTROL_FLOTA.VEHICLE_SHIFT,
					active: true
				},
				{
					title: 'Calendario',
					icon: Calendar,
					url: Routes.CONTROL_FLOTA.DASHBOARD,
					active: true
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
		{
			title: "Vehículos",
			url: "#",
			icon: BusFront,
			isActive: true,
			items: [
				{
					title: 'Detalle de Móviles',
					icon: Car,
					url: Routes.VEHICLES.HOME,
					active: false
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
		// 			icon: BarChart3,
		//			active: false
		// 		},
		// 		{
		// 			title: "Cumplimiento 2024",
		// 			url: "#",
		// 			icon: BarChart3,
		//			active: false
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