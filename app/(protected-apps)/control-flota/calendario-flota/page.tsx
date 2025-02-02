import { Suspense } from "react"
import { VehicleShiftsSummary } from "@/components/vehicle-shifts/fleet/vehicle-shifts-summary"
import SuspenseLoading from "@/components/ui/suspense"

export default function FleetShiftsPage() {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <VehicleShiftsSummary />
        </Suspense>
    )
}
