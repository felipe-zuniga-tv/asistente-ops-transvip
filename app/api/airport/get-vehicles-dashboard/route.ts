import { getAirportStatus } from '@/lib/chat/functions'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const branchId = request.nextUrl.searchParams.get('branchId') as string
    const zoneId = request.nextUrl.searchParams.get('zoneId') as string
    const vehicleIdList = request.nextUrl.searchParams.get('vehicleId')

    if (!zoneId || !vehicleIdList) {
        return NextResponse.json({ error: 'Missing zoneId or vehicleId' }, { status: 400 })
    }

    const data = await getAirportStatus(parseInt(branchId, 10), parseInt(zoneId, 10), vehicleIdList)
    return NextResponse.json(data)
}