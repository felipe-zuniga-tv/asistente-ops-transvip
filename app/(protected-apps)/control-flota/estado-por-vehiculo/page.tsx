import { VehicleStatus } from "@/components/vehicle-status/vehicle-status";
import { getVehicleStatusConfigs, getVehicleStatuses } from '@/lib/services/database/actions';
import { Suspense } from "react";
import SuspenseLoading from "@/components/ui/suspense";

export const revalidate = 60;

async function VehicleStatusPageContent() {
    const statuses = await getVehicleStatuses()
    const statusConfigs = await getVehicleStatusConfigs()

    return <VehicleStatus statuses={statuses} statusConfigs={statusConfigs} />
}

export default async function VehicleStatusPage() {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <VehicleStatusPageContent />
        </Suspense>
    );
}