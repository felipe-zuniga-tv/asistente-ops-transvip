import { Suspense } from "react"
import { VehicleShiftsSummary } from "@/components/vehicle-shifts/fleet/vehicle-shifts-summary"

export default function FleetShiftsPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <VehicleShiftsSummary />
        </Suspense>
    )
}
