import { NextRequest, NextResponse } from 'next/server';
import { getVehicleOnlineStatus } from '@/lib/features/vehicle/functions';

export async function POST(request: NextRequest) {
  // Attempt to parse JSON; return 400 if parsing fails
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }

  const { vehicleNumber } = body;
  if (!vehicleNumber) {
    return NextResponse.json({ error: 'Vehicle number is required in request body' }, { status: 400 });
  }

  // Validate that vehicleNumber is a clean integer string using regex
  const trimmedValue = String(vehicleNumber).trim();
  if (!/^\d+$/.test(trimmedValue)) {
    return NextResponse.json({ error: 'Invalid vehicle number format. Must be an integer.' }, { status: 400 });
  }

  const parsedNumber = parseInt(trimmedValue, 10);
  if (isNaN(parsedNumber) || parsedNumber <= 0) {
    return NextResponse.json({ error: 'Invalid vehicle number. Must be an integer > 0.' }, { status: 400 });
  }
  
  try {
    const statusResult = await getVehicleOnlineStatus(parsedNumber);
    if (statusResult == null) {
      return NextResponse.json({ error: 'Vehicle status not found' }, { status: 404 });
    }
    return NextResponse.json(statusResult);
  } catch (error: any) {
    console.error('Error fetching vehicle status for vehicle:', parsedNumber, error);
    return NextResponse.json({ error: 'Failed to fetch vehicle status', details: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
} 