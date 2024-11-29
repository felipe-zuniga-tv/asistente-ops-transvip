import { NextResponse } from 'next/server';

const ROUTE_CREATION_ENDPOINT = 'https://southamerica-west1-ops-chat-app.cloudfunctions.net/route-optimization-functions'

export async function POST(request: Request) {
    const { bookings, vehicles } = await request.json();

    // First, get the Latitude/Longitude for each booking

    console.log(bookings)
    console.log(vehicles)
    

    return NextResponse.json({ message: 'Data received', data: { bookings, vehicles } });
}
