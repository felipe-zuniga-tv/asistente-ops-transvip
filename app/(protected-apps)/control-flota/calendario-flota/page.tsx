import { Suspense } from "react"
import { VehicleShiftsSummary } from "@/components/vehicle-shifts/fleet/vehicle-shifts-summary"
import SuspenseLoading from "@/components/ui/suspense"
import { getBranches } from "@/lib/services/admin"

export default async function FleetShiftsPage() {
    const branches = await getBranches()
    
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <VehicleShiftsSummary branches={branches} />
        </Suspense>
    )
}
