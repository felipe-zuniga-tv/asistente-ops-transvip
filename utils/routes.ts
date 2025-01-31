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
		SHIFTS: '/control-flota/shifts',
		VEHICLE_SHIFT: '/control-flota/vehicles',
		DASHBOARD: '/control-flota/dashboard',
		VEHICLE_STATUS: '/control-flota/vehicle-status',
	},
	ADMIN: {
		HOME: '/admin',
		BRANCH_CONFIG: '/admin/branch-config',
		VEHICLE_STATUS_CONFIG: '/admin/vehicle-status-config',
		PAYMENT_CONFIG: '/admin/payment-config',
		VEHICLE_TYPES: '/admin/vehicle-types',
	},
	SALES: {
		HOME: '/sucursales',
		FORM: '/sucursales/venta',
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