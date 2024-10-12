import { Suspense } from 'react'
import AirportStatusClient from '@/components/airport/airport-status-client'
import { getZonaIluminadaServices } from '@/lib/chat/functions'
import SuspenseLoading from '@/components/ui/suspense'

export default function DashboardPage() {
  return (
    <Suspense fallback={<SuspenseLoading />}>
      <AirportStatusDashboard zoneId={2} /> {/* Default to Santiago */}
    </Suspense>
  )
}

async function AirportStatusDashboard({ zoneId }: { zoneId: number }) {
    const data = await getZonaIluminadaServices(zoneId)
    console.log(data);
    
    return <AirportStatusClient vehicleTypesList={data} zoneId={zoneId} />
  }