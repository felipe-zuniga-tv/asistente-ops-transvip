import { Metadata } from "next";
import { VehicleStatusConfig } from "@/components/admin/vehicle-status/vehicle-status-config";
import { getVehicleStatusConfigs } from "@/lib/database/actions";
import { Suspense } from "react";
import SuspenseLoading from "@/components/ui/suspense";

export const metadata: Metadata = {
    title: "Configuración de Estados | Transvip",
    description: "Administra los estados disponibles para los vehículos",
};

export const revalidate = 0;

export default async function VehicleStatusConfigPage() {
    const configs = await getVehicleStatusConfigs();

    return (
        <Suspense fallback={<SuspenseLoading />}>
            <VehicleStatusConfig configs={configs} />
        </Suspense>
    );
} 