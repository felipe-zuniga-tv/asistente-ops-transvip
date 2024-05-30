export const branches = [
    { branch_id: 1, name: 'Santiago', code: 'SCL' },
    { branch_id: 179, name: 'Calama', code: 'CJC' },
    { branch_id: 34, name: 'Antofagasta', code: 'ANF' },
]

export const bookingStatus = [
    { status: 0, label: 'Asignada', color: 'bg-black' },
    { status: 2, label: 'Completada', color: 'bg-green-700 hover:bg-green-600' },
    { status: 6, label: 'No asignada', color: 'bg-red-600 hover:bg-red-500' },
    { status: 9, label: 'Cancelada', color: 'bg-orange-800 hover:bg-orange-700' },
    { status: 12, label: 'No Show', color: 'bg-yellow-500 hover:bg-yellow-400' },
    { status: 15, label: 'En camino', color: 'bg-blue-400 bg-blue-500' },
]

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