import { Suspense } from "react"
import { VehicleShiftsSummary } from "@/components/features/vehicles/fleet/vehicle-shifts-summary"
import SuspenseLoading from "@/components/ui/suspense"
import { getBranches } from "@/lib/features/admin"

async function FleetShiftsPageContent() {
    const branches = await getBranches()
    return <VehicleShiftsSummary branches={branches} />
}

export default async function FleetShiftsPage() {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <FleetShiftsPageContent />
        </Suspense>
    )
}