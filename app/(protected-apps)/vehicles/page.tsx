import React, { Suspense } from 'react';
import { VehicleList } from "@/components/vehicle-list/vehicle-list"
import { getVehicleList } from "@/lib/services/chat/functions"
import SuspenseLoading from '@/components/ui/suspense';

const DEFAULT_BRANCH = 1 // Santiago

export default function VehiclesPage() {
    return (
        <Suspense fallback={<SuspenseLoading text="Cargando vehículos..." />}>
            <VehiclesContent />
        </Suspense>
    );
}

async function VehiclesContent() {
    const vehicles = await getVehicleList(DEFAULT_BRANCH) || [];
    return <VehicleList branch={DEFAULT_BRANCH} initialVehicles={vehicles} />;
}