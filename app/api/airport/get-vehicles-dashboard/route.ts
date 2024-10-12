import { getAirportStatus } from '@/lib/chat/functions'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const zoneId = request.nextUrl.searchParams.get('zoneId')
  const branchId = request.nextUrl.searchParams.get('branchId')
  const vehicleIdList = request.nextUrl.searchParams.get('vehicleId')
  
  if (!zoneId || !vehicleIdList) {
    return NextResponse.json({ error: 'Missing zoneId or vehicleId' }, { status: 400 })
  }

  const data = await getAirportStatus(branchId, zoneId, vehicleIdList)
  return NextResponse.json(data)
}