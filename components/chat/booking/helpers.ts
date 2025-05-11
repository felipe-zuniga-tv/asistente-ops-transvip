import type { IBookingInfoOutput } from '@/types/domain/chat/models'

export enum BookingSearchRequest {
    BOOKING = 'booking',
    VEHICLE = 'vehicle',
    LICENSE = 'license',
    DRIVER = 'driver',
    SHARED_SERVICE = 'shared_service',
}

export const MESSAGE_TEMPLATES: Record<
  BookingSearchRequest,
  (result: IBookingInfoOutput) => string
> = {
    [BookingSearchRequest.BOOKING]: (result) =>
        `Me gustaría buscar la reserva ${result.booking.id}.`,
    [BookingSearchRequest.VEHICLE]: (result) =>
        `Me gustaría saber si el vehículo ${result.vehicle.vehicle_number} está online.`,
    [BookingSearchRequest.LICENSE]: (result) =>
        `Me gustaría saber más información sobre el vehículo con patente ${result.vehicle.license_plate}.`,
    [BookingSearchRequest.DRIVER]: (result) =>
        `Me gustaría buscar sólo el perfil del conductor con el teléfono ${result.fleet.phone_number}.`,
    [BookingSearchRequest.SHARED_SERVICE]: (result) =>
        `Me gustaría buscar el paquete ${result.booking.shared_service_id}.`,
} 