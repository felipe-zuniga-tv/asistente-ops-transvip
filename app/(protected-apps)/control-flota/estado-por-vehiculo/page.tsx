import { VehicleStatus } from "@/components/vehicle-status/vehicle-status";
import { getVehicleStatusConfigs, getVehicleStatuses } from '@/lib/services/database/actions';
import { Suspense } from "react";
import SuspenseLoading from "@/components/ui/suspense";

export const revalidate = 0;

export default async function VehicleStatusPage() {
    const statuses = await getVehicleStatuses()
    const statusConfigs = await getVehicleStatusConfigs()

    return (
        <Suspense fallback={<SuspenseLoading />}>
            <VehicleStatus statuses={statuses} statusConfigs={statusConfigs} />
        </Suspense>
    );
}