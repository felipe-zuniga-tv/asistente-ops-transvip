export const Routes = Object.freeze({
	HOME: '/',
	LOGIN: '/',
	CHAT: '/chat',
	START: '/chat',
	QR_GEN: '/qr',
	AIRPORT: {
		HOME: '/aeropuerto',
		ZI: '/aeropuerto/zi',
		ZI_SCL: '/aeropuerto/zi/scl',
		ZI_ANF: '/aeropuerto/zi/anf',
		ZI_CJC: '/aeropuerto/zi/cjc',
	},
	BOOKINGS: {
		SHARED: '/reservas/compartidas',
	},
	VEHICLES: {
		HOME: '/vehicles',
	},
	CONTROL_FLOTA: {
		SHIFTS: '/control-flota/definicion-turnos',
		VEHICLE_SHIFT: '/control-flota/asignacion-turno',
		SHIFTS_PER_VEHICLE: '/control-flota/calendario-por-vehiculo',
		VEHICLE_STATUS: '/control-flota/estado-por-vehiculo',
		FLEET_SHIFTS_CALENDAR: '/control-flota/calendario-flota',
	},
	ADMIN: {
		HOME: '/admin',
		BRANCH_CONFIG: '/admin/branch-config',
		FORMS_CONFIG: '/admin/forms-config',
		VEHICLE_STATUS_CONFIG: '/admin/vehicle-status-config',
		PAYMENT_CONFIG: '/admin/payment-config',
		VEHICLE_TYPES: '/admin/vehicle-types',
	},
	FINANCE: {
		TICKETS: '/finanzas/tickets',
	},
	DATA: {
		HOME: '/data',
		GEOFENCES: '/data/geofences',
	},
	TEXT: {
		WRITE: '/write',
	},
	ROUTING: {
		MAIN: '/ruteo'
	},
	FEEDBACK: {
		GOOGLE_FORMS: 'https://forms.gle/qeiBzwNhUwD5WcLt8'
	},
	PUBLIC: {
		SUCURSALES: '/sucursales',
		VENTA_SUCURSALES: '/sucursales/venta',
		TURNOS: '/turnos',
	}
})