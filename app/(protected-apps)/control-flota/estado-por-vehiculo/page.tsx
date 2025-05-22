import { VehicleStatus } from "@/components/features/vehicle-status/vehicle-status";
import { getVehicleStatusConfigs, getVehicleStatuses } from "@/lib/features/vehicle-status";

export const revalidate = 60;

export default async function VehicleStatusPage() {
    const statuses = await getVehicleStatuses()
    const statusConfigs = await getVehicleStatusConfigs()

    return <VehicleStatus statuses={statuses} statusConfigs={statusConfigs} />
}