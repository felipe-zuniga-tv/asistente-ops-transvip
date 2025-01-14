import { VehicleList } from "@/components/vehicles/vehicle-list"
import { getVehicleList } from "@/lib/chat/functions"

const DEFAULT_BRANCH = 1 // Santiago

export default async function VehiclesPage() {
    try {
        const vehicles = await getVehicleList(DEFAULT_BRANCH) || []
        return <VehicleList branch={DEFAULT_BRANCH} initialVehicles={vehicles} />
    } catch (error) {
        // Consider using error.tsx boundary instead
        throw new Error('Failed to load vehicles')
    }
}