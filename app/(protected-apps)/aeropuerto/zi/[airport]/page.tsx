import { Suspense } from 'react'
import SuspenseLoading from '@/components/ui/suspense'
import AirportStatusClient from '@/components/features/airport/zi/airport-status-client'
import { getZonaIluminadaServices } from '@/lib/features/airport-status'
import { BranchAirportZone } from '@/types/domain/airport/types'
import { airportZones } from '@/lib/core/config/airport'

export default async function AirportPage(props: { params: Promise<{ airport: string }> }) {
  const params = await props.params;
  const airport = params.airport
  const airportZone = airportZones.filter(a => a.airport_code === airport.toUpperCase())[0]

  return (
    <Suspense fallback={<SuspenseLoading />}>
      <AirportStatusDashboard zone={airportZone} />
    </Suspense>
  )
}

async function AirportStatusDashboard({ zone }: { zone: BranchAirportZone }) {
  const data = await getZonaIluminadaServices(zone.zone_id)
  return <AirportStatusClient vehicleTypesList={data} zone={zone} />
}