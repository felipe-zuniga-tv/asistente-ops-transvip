import { getBranches } from "@/lib/features/admin"
import { FleetCurrentShifts } from "@/components/features/vehicles/fleet/vehicle-current-shifts"

export default async function CurrentShiftsPage() {
    const branches = await getBranches()
    return <FleetCurrentShifts branches={branches} />
}