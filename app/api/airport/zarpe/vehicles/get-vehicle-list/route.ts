import { getAirportMinibusList } from '@/lib/chat/functions'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const airportCode = request.nextUrl.searchParams.get('airportCode') as string

    if (!airportCode) {
        return NextResponse.json({ error: 'Missing airport code' }, { status: 400 })
    }

    const data = await getAirportMinibusList(airportCode)
    console.log(data)
    return NextResponse.json(data)
}