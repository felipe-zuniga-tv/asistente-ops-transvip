import { VehicleList } from "@/components/vehicles/vehicle-list"
import { getVehicleList } from "@/lib/chat/functions"

const DEFAULT_BRANCH = 1 // Santiago

export default async function VehiclesPage() {
    const vehicleList = await getVehicleList(DEFAULT_BRANCH) || []
    console.log(vehicleList)

    return <VehicleList branch={DEFAULT_BRANCH} initialVehicles={vehicleList} />
}