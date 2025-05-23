import { getBookingInfo } from '@/lib/features/booking';
import { getVehicleDetailList } from '@/lib/features/vehicle/functions';
import { NextResponse } from 'next/server';

const ROUTE_CREATION_ENDPOINT = 'https://southamerica-west1-ops-chat-app.cloudfunctions.net/route-optimization-functions'

export async function POST(request: Request) {
    const { bookings, vehicles } = await request.json();

    // Turn into arrays
    const bookingList = bookings.split(",").map((x: string) => parseInt(x))
    const vehicleList = vehicles.split(",").map((x: string) => parseInt(x))

    // First, get the Latitude/Longitude for each booking
    const bookingDetails = await Promise.all(
        bookingList.map(async (booking: number) => {
            const result = await getBookingInfo(booking, false)

            if (!result) return

            return {
                booking_id: result[0].booking.id,
                pax: result[0].booking.pax_count,
                service_name: result[0].booking.service_name,
                origin: {
                    latitude: result[0].directions.origin.latitude,
                    longitude: result[0].directions.origin.longitude,
                },
                destination: {
                    latitude: result[0].directions.destination.latitude,
                    longitude: result[0].directions.destination.longitude,
                },
            }
        })
    )

    const vehicleDetails = await Promise.all(
        vehicleList.map(async (vehicle_number: number) => {
            const vehicleDetailList = await getVehicleDetailList(String(vehicle_number));
            const result = vehicleDetailList ? vehicleDetailList.find((r: any) => r.vehicle_number === vehicle_number) : null;

            if (!result) return;

            return {
                vehicle_number,
                license_plate: result.license_plate,
                contract: result.contract.type,
                model: result.model.name,
                color: result.color.name,
                owner: result.owner,
            }
        })
    )

    const response = await fetch(ROUTE_CREATION_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ bookings: bookingDetails, vehicles: vehicleDetails })
    })

    const data = await response.json()

    return NextResponse.json({ message: 'Data received', data: { bookings, vehicles } });
}
