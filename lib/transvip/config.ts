export const branches = [
    { branch_id: 1, name: 'Santiago', code: 'SCL' },
    { branch_id: 179, name: 'Calama', code: 'CJC' },
    { branch_id: 34, name: 'Antofagasta', code: 'ANF' },
]

export const bookingStatus = [
    { status: 0, label: 'Asignada', key: 'ASSIGNED' },
    { status: 2, label: 'Completada', key: 'COMPLETED' },
    { status: 4, label: 'En Posición', key: 'ARRIVED' },
    { status: 6, label: 'No asignada', key: 'UNASSIGNED' },
    { status: 9, label: 'Cancelada', key: 'CANCELLED' },
    { status: 12, label: 'No Show', key: 'NO_SHOW' },
    { status: 15, label: 'En camino', key: 'ON_ROAD' },
]

export type bookingStatusKey = 'ASSIGNED' | 'COMPLETED' | 'ARRIVED' | 'UNASSIGNED' | 'CANCELLED' | 'NO_SHOW' | 'ON_ROAD'

export const bookingStatusColor = {
    ASSIGNED: 'bg-black',
    COMPLETED: 'bg-green-700 hover:bg-green-600',
    UNASSIGNED: 'bg-red-600 hover:bg-red-500',
    ARRIVED: 'bg-orange-800 hover:bg-orange-700',
    CANCELLED: 'bg-orange-800 hover:bg-orange-700',
    NO_SHOW: 'bg-yellow-500 hover:bg-yellow-400',
    ON_ROAD: 'bg-blue-400 hover:bg-blue-500',
}

export const paymentStatus = [
    { status: 0, label: 'No Pagada' },
    { status: 1, label: 'Pagada' },
    { status: 2, label: 'Pagada' },
]

export const driverStatus = [
    { status: 0, label: 'Offline' },
    { status: 1, label: 'Online' },
]

export const vehicleStatus = [
    { status: 0, label: 'Inactivo', color: 'bg-red-400 hover:bg-red-400' },
    { status: 1, label: 'Activo', color: 'bg-green-700 hover:bg-green-700' },
]

export const paymentMethods = {
    CARD: 'Tarjeta de Credito o Debito',
    FACTURA: 'Factura Credito',
    CASH: 'Efectivo Pesos',
}