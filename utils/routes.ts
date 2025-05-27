export const Routes = Object.freeze({
	HOME: '/',
	LOGIN: '/',
	START: '/chat',
	API: {
		CUSTOMER_SIGNUP: '/api/customers/signup',
	},
	ADMIN: {
		HOME: '/admin',
		BRANCHES_CONFIG: '/admin/config/branches',
		VEHICLE_STATUS_CONFIG: '/admin/config/vehicle-status',
		VEHICLE_TYPES_CONFIG: '/admin/config/vehicle-types',
		PAYMENT_METHODS_CONFIG: '/admin/config/payment-methods',
		SYSTEM_CONFIG: '/admin/config/system',
		ACCESS_CONTROL: '/admin/config/access-control',
	},
	AIRPORT: {
		HOME: '/aeropuerto',
		ZI: '/aeropuerto/zi',
		ZI_ANF: '/aeropuerto/zi/anf',
		ZI_CJC: '/aeropuerto/zi/cjc',
		ZI_SCL: '/aeropuerto/zi/scl',
	},
	BOOKINGS: {
		SHARED: '/reservas/compartidas',
	},
	CHAT: '/chat',
	CONTROL_FLOTA: {
		FLEET_SHIFTS_CALENDAR: '/control-flota/calendario-flota',
		TODAYS_SHIFTS: '/control-flota/turnos-hoy',
		SHIFTS: '/control-flota/definicion-turnos',
		SHIFTS_PER_VEHICLE: '/control-flota/calendario-por-vehiculo',
		VEHICLE_SHIFT: '/control-flota/asignacion-turno',
		VEHICLE_STATUS: '/control-flota/estado-por-vehiculo',
	},
	DATA: {
		HOME: '/data',
		GEOFENCES: '/data/geofences',
	},
	DRIVERS: {
		HOME: '/conductores',
		TICKETS_DASHBOARD: '/conductores/tickets/parking/dashboard',
		PROFILE: '/conductores/perfil',
	},
	FEEDBACK: {
		GOOGLE_FORMS: 'https://forms.gle/qeiBzwNhUwD5WcLt8',
	},
	FINANCE: {
		TICKETS: '/finanzas/tickets',
		TICKETS_SUMMARY: '/finanzas/tickets/resumen',
	},
	OPERATIONS_FORMS: {
		HOME: '/forms',
		CONFIG: '/forms/config',
	},
	PUBLIC: {
		SUCURSALES: '/sucursales',
		VENTA_SUCURSALES: '/sucursales/venta',
		TURNOS: '/turnos',
		FORMULARIOS: '/formularios',
		TICKETS: '/conductores',
		SEGURIDAD: '/seguridad',
	},
	QR_GEN: '/qr-code',
	ROUTING: {
		MAIN: '/ruteo',
	},
	SALES: {
		RESPONSES: '/ventas/respuestas',
		RESPONSES_SUMMARY: '/ventas/respuestas/resumen',
		BRANCH_RESPONSES: '/ventas/respuestas/:branch',
	},
	SEGURIDAD: {
		HOME: '/sso',
		CONDUCTORES: '/sso/conductores',
		VEHICULOS: '/sso/moviles',
		ASIGNACIONES: '/sso/asignaciones',
		RESUMEN: '/sso/resumen',
	},
	TEXT: {
		WRITE: '/write',
	},
	VEHICLES: {
		HOME: '/vehicles',
	},
});