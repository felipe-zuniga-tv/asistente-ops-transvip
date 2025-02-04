import { Tool } from "@/lib/types/chat";
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
	AlertTriangle,
	Plane,
	Settings,
	Sliders,
	Settings2,
	CreditCard,
	Building2,
	Building,
	Sun,
	ListChecks,
	ShoppingCart,
} from "lucide-react"
import { toolsList } from "./tools";

export interface SidebarItem {
	title: string;
	url: string;
	icon: LucideIcon;
	isActive?: boolean;
	items?: Tool[]; // Recursive type for nested items
}

// Sidebar content
export const publicSidebar: SidebarItem = {
	title: "Acceso Público",
	url: "#",
	icon: Sun,
	isActive: false,
	items: [
		{
			title: "Form Ventas Sucursales",
			url: Routes.PUBLIC.SUCURSALES,
			icon: Building,
			active: true,
		},
		{
			title: "Turnos Flota",
			url: Routes.PUBLIC.TURNOS,
			icon: CalendarClock,
			active: true,
		},
	],
}

export const chatbotMenu: SidebarItem = {
	title: "Chatbot Operaciones",
	url: "#",
	icon: Bot,
	isActive: false,
	items: toolsList,
}

const toolsMenu: SidebarItem = {
	title: "Herramientas",
	url: "#",
	icon: Hammer,
	isActive: false,
	items: [
		// {
		// 	title: 'Chatbot Operaciones',
		// 	icon: Bot,
		// 	url: Routes.CHAT,
		// 	active: true
		// },
		{
			title: 'Genera tu código QR',
			icon: QrCodeIcon,
			url: Routes.QR_GEN,
			active: true
		},
		{
			title: 'Coordenadas GeoJSON',
			icon: Map,
			url: Routes.DATA.GEOFENCES,
			active: true
		},
		{
			title: 'Redacta un texto',
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
			url: Routes.ROUTING.MAIN,
			active: false
		},
	],
}

export const salesMenu: SidebarItem = {
	title: "Ventas",
	url: "#",
	icon: ShoppingCart,
	isActive: false,
	items: [
		{
			title: "Respuestas de Formularios",
			url: Routes.SALES.RESPONSES,
			icon: ListChecks,
			active: true,
		},
	],
}

const controlFlotaMenu: SidebarItem = {
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
			title: 'Asignar Turno al Móvil',
			icon: CarFront,
			url: Routes.CONTROL_FLOTA.VEHICLE_SHIFT,
			active: true
		},
		{
			title: 'Asignar Estado al Móvil',
			icon: AlertTriangle,
			url: Routes.CONTROL_FLOTA.VEHICLE_STATUS,
			active: true
		},
		{
			title: 'Turnos por Móvil',
			icon: Calendar,
			url: Routes.CONTROL_FLOTA.SHIFTS_PER_VEHICLE,
			active: true
		},
		{
			title: 'Calendario de Turnos',
			icon: Calendar,
			url: Routes.CONTROL_FLOTA.FLEET_SHIFTS_CALENDAR,
			active: true
		},
	],
}

const vehiclesMenu: SidebarItem = {
	title: "Vehículos",
	url: "#",
	icon: BusFront,
	isActive: false,
	items: [
		{
			title: 'Detalle de Móviles',
			icon: Car,
			url: Routes.VEHICLES.HOME,
			active: true
		},
	],
}

const adminMenu: SidebarItem = {
	title: "Configuración",
	url: Routes.ADMIN.HOME,
	icon: Settings,
	isActive: false,
	items: [
		{
			title: 'Estados del Móvil',
			icon: Settings2,
			url: Routes.ADMIN.VEHICLE_STATUS_CONFIG,
			active: true
		},
		{
			title: 'Métodos de Pago',
			icon: CreditCard,
			url: Routes.ADMIN.PAYMENT_CONFIG,
			active: true
		},
		{
			title: 'Tipos de Vehículo',
			icon: CarFront,
			url: Routes.ADMIN.VEHICLE_TYPES,
			active: true
		},
		{
			title: 'Sucursales',
			icon: Building2,
			url: Routes.ADMIN.BRANCH_CONFIG,
			active: true
		},
		{
			title: 'Formularios',
			icon: ListChecks,
			url: Routes.ADMIN.FORMS_CONFIG,
			active: false
		},
	],
}

export const sidebarData: { navMain: SidebarItem[], navSecondary: SidebarItem[] } = {
	navMain: [
		publicSidebar,
		chatbotMenu,
		toolsMenu,
		salesMenu,
		controlFlotaMenu,
		{
			title: "Reservas",
			url: "#",
			icon: BookPlusIcon,
			isActive: false,
			items: [
				{
					title: 'Compartidas',
					icon: BusFront,
					url: Routes.BOOKINGS.SHARED,
					active: true
				},
			],
		},
		// vehiclesMenu,
		adminMenu,
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
	],
	navSecondary: [
		{
			title: "Feedback",
			url: Routes.FEEDBACK.GOOGLE_FORMS,
			icon: Send,
		},
	]
}