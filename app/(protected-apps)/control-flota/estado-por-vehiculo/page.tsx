import { VehicleStatus } from "@/components/vehicle-status/vehicle-status";
import { getVehicleStatuses } from '@/lib/database/actions';
import { Suspense } from "react";
import SuspenseLoading from "@/components/ui/suspense";

export const revalidate = 0;

export default async function VehicleStatusPage() {
    const statuses = await getVehicleStatuses()

    return (
        <Suspense fallback={<SuspenseLoading />}>
            <VehicleStatus statuses={statuses} />
        </Suspense>
    );
}