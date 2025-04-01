import { getBookingInfo } from '@/lib/services/booking';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { bookingId } = await request.json();
        
        if (!bookingId) {
            return NextResponse.json(
                { error: 'Booking ID is required' },
                { status: 400 }
            );
        }

        const info = await getBookingInfo(Number(bookingId), true);
        return NextResponse.json({ data: info });
        
    } catch (error) {
        console.error("Error fetching booking:", error);
        return NextResponse.json(
            { error: 'Failed to fetch booking information' },
            { status: 500 }
        );
    }
}