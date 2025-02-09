export const Routes = Object.freeze({
	HOME: '/',
	LOGIN: '/',
	START: '/chat',
	ADMIN: {
		HOME: '/admin',
		BRANCH_CONFIG: '/admin/branch-config',
		VEHICLE_STATUS_CONFIG: '/admin/vehicle-status-config',
		VEHICLE_TYPES: '/admin/vehicle-types',
		PAYMENT_CONFIG: '/admin/payment-config',
		SYSTEM_CONFIG: '/admin/system-config',
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
		PROFILE: '/conductores/perfil',
	},
	FEEDBACK: {
		GOOGLE_FORMS: 'https://forms.gle/qeiBzwNhUwD5WcLt8',
	},
	FINANCE: {
		TICKETS: '/finanzas/tickets',
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
	},
	QR_GEN: '/qr-code',
	ROUTING: {
		MAIN: '/ruteo',
	},
	SALES: {
		RESPONSES: '/ventas/respuestas',
	},
	TEXT: {
		WRITE: '/write',
	},
	VEHICLES: {
		HOME: '/vehicles',
	},
});