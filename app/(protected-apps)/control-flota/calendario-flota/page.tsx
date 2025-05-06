import { getBranches } from "@/lib/features/admin"
import { VehicleShiftsSummary } from "@/components/features/vehicles/fleet/vehicle-shifts-summary"

export default async function FleetShiftsPage() {
    const branches = await getBranches()
    return <VehicleShiftsSummary branches={branches} />
}