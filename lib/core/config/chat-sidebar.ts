import { Routes } from "@/utils/routes";
import {
	Hammer,
	LucideIcon,
	QrCodeIcon,
	Send,
	Bot,
	Ticket,
	Map,
	BookPlusIcon,
	BusFront,
	MapPin,
	Pencil,
	Car,
	TowerControl,
	Calendar,
	CarFront,
	CalendarClock,
	AlertTriangle,
	Settings,
	Settings2,
	CreditCard,
	Building2,
	Building,
	Sun,
	ListChecks,
	House,
	ClipboardList,
	UserRound,
	ChartBar,
	BarChart3,
} from "lucide-react"
import { toolsList } from "./tools";
import { SidebarItem } from "@/components/features/chat/panel/types";

// Sidebar content
export const publicSidebar: SidebarItem = {
	title: "Acceso Público",
	url: "#",
	icon: Sun,
	active: false,
	highlight: true,
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
		{
			title: "Forms Operaciones",
			url: Routes.PUBLIC.FORMULARIOS,
			icon: ListChecks,
			active: true,
		},
		{
			title: "Tickets Estacionamiento",
			url: Routes.PUBLIC.TICKETS,
			icon: Ticket,
			active: true,
		},
	],
}

const formsMenu: SidebarItem = {
	title: "Formularios Operaciones",
	url: Routes.OPERATIONS_FORMS.HOME,
	icon: ListChecks,
	active: false,
	items: [
		{
			title: "Forms Operaciones Activos",
			url: Routes.OPERATIONS_FORMS.HOME,
			icon: ClipboardList,
			active: true,
		},
		{
			title: "Configuración",
			url: Routes.OPERATIONS_FORMS.CONFIG,
			icon: Settings,
			active: true,
		},
	],
}

const salesFormsMenu: SidebarItem = {
	title: "Formularios Sucursales",
	url: '#',
	icon: ListChecks,
	active: false,
	items: [
		{
			title: "Respuestas",
			url: Routes.SALES.RESPONSES,
			icon: ListChecks,
			active: true,
		},
		{
			title: "Resumen Respuestas",
			url: Routes.SALES.RESPONSES_SUMMARY,
			icon: BarChart3,
			active: true,
		},
	],
}

export const chatbotMenu: SidebarItem = {
	title: "Chatbot Operaciones",
	url: "#",
	icon: Bot,
	active: false,
	items: toolsList,
}

const toolsMenu: SidebarItem = {
	title: "Herramientas varias",
	url: "#",
	icon: Hammer,
	active: false,
	items: [
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
	],
}

const financeMenu: SidebarItem = {
	title: "Finanzas",
	url: "#",
	icon: ChartBar,
	active: false,
	items: [
		{
			title: 'Tickets Estacionamiento',
			icon: Ticket,
			url: Routes.FINANCE.TICKETS,
			active: true
		},
		{
			title: 'Resumen Tickets',
			icon: BarChart3,
			url: Routes.FINANCE.TICKETS_SUMMARY,
			active: true
		},
	],
}

const controlFlotaAdminMenu: SidebarItem = {
	title: "Control de Flota",
	url: "#",
	icon: TowerControl,
	active: false,
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
			title: 'Ver Turnos por Móvil',
			icon: Calendar,
			url: Routes.CONTROL_FLOTA.SHIFTS_PER_VEHICLE,
			active: true
		},
		{
			title: 'Turnos de Hoy',
			icon: Calendar,
			url: Routes.CONTROL_FLOTA.TODAYS_SHIFTS,
			active: true
		},
		// {
		// 	title: 'Ver Calendario de Turnos',
		// 	icon: Calendar,
		// 	url: Routes.CONTROL_FLOTA.FLEET_SHIFTS_CALENDAR,
		// 	active: true
		// },
	],
}

const controlFlotaViewMenu: SidebarItem = {
	title: "Control de Flota - Turnos",
	url: "#",
	icon: TowerControl,
	active: false,
	items: [
		{
			title: 'Ver Turnos por Móvil',
			icon: Calendar,
			url: Routes.CONTROL_FLOTA.SHIFTS_PER_VEHICLE,
			active: true
		},
		{
			title: 'Turnos de Hoy',
			icon: Calendar,
			url: Routes.CONTROL_FLOTA.TODAYS_SHIFTS,
			active: true
		},
		// {
		// 	title: 'Ver Calendario de Turnos',
		// 	icon: Calendar,
		// 	url: Routes.CONTROL_FLOTA.FLEET_SHIFTS_CALENDAR,
		// 	active: true
		// },
	],
}

const vehiclesMenu: SidebarItem = {
	title: "Vehículos",
	url: "#",
	icon: BusFront,
	active: false,
	items: [
		{
			title: 'Detalle de Móviles',
			icon: Car,
			url: Routes.VEHICLES.HOME,
			active: true
		},
	],
}

const driversMenu: SidebarItem = {
	title: "Conductores",
	url: "#",
	icon: UserRound,
	active: false,
	items: [
		{
			title: 'Buscar Conductores',
			icon: UserRound,
			url: Routes.DRIVERS.HOME,
			active: true
		},
	],
}

const safetyMenu: SidebarItem = {
	title: "Seguridad",
	url: "#",
	icon: UserRound,
	active: false,
	items: [
		{
			title: 'Buscar Conductores',
			icon: UserRound,
			url: Routes.SEGURIDAD.CONDUCTORES,
			active: true
		},
		{
			title: 'Buscar Vehículos',
			icon: Car,
			url: Routes.SEGURIDAD.VEHICULOS,
			active: true
		},
	],
}

const bookingsMenu: SidebarItem = {
	title: "Reservas",
	url: "#",
	icon: BookPlusIcon,
	active: false,
	items: [
		{
			title: 'Compartidas',
			icon: BusFront,
			url: Routes.BOOKINGS.SHARED,
			active: true
		},
		{
			title: 'Ruteo Reservas',
			icon: MapPin,
			url: Routes.ROUTING.MAIN,
			active: false
		},
	],
}

// const configMenu: SidebarItem = {
// 	title: "Configuración",
// 	url: Routes.ADMIN.HOME,
// 	icon: Settings,
// 	active: false,
// 	items: [
// 		{
// 			title: 'Control de Acceso',
// 			icon: UserRound,
// 			url: Routes.ADMIN.ACCESS_CONTROL,
// 			active: true
// 		},
// 		{
// 			title: 'Estados del Móvil',
// 			icon: Settings2,
// 			url: Routes.ADMIN.VEHICLE_STATUS_CONFIG,
// 			active: true
// 		},
// 		{
// 			title: 'Métodos de Pago',
// 			icon: CreditCard,
// 			url: Routes.ADMIN.PAYMENT_METHODS_CONFIG,
// 			active: true
// 		},
// 		{
// 			title: 'Tipos de Vehículo',
// 			icon: CarFront,
// 			url: Routes.ADMIN.VEHICLE_TYPES_CONFIG,
// 			active: true
// 		},
// 		{
// 			title: 'Sucursales',
// 			icon: Building2,
// 			url: Routes.ADMIN.BRANCHES_CONFIG,
// 			active: true
// 		},
// 		{
// 			title: 'Configuración de Sistema',
// 			icon: Settings2,
// 			url: Routes.ADMIN.SYSTEM_CONFIG,
// 			active: true
// 		},
// 	],
// }

export const sidebarData: { navMain: SidebarItem[], navSecondary: SidebarItem[] } = {
	navMain: [
		publicSidebar,
		chatbotMenu,
		toolsMenu,
		financeMenu,
		formsMenu,
		salesFormsMenu,
		safetyMenu,
		controlFlotaAdminMenu,
		controlFlotaViewMenu,
		bookingsMenu,
		// driversMenu,
		// vehiclesMenu,
		// configMenu,
	],
	navSecondary: [
		{
			title: "Configuración",
			url: Routes.ADMIN.HOME,
			icon: Settings,
			external: false,
		},
		{
			title: "Feedback",
			url: Routes.FEEDBACK.GOOGLE_FORMS,
			icon: Send,
			external: true,
		},
	]
}