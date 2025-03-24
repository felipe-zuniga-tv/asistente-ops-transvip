import { Suspense } from "react";
import { VehicleStatusConfig } from "@/components/admin/vehicle-status/vehicle-status-config";
import { getVehicleStatusConfigs } from "@/lib/services/database/actions";
import SuspenseLoading from "@/components/ui/suspense";

export const metadata = {
    title: "Configuración de Estados | Transvip",
    description: "Administra los estados disponibles para los vehículos",
};

async function VehicleStatusConfigDashboard() {
    const configs = await getVehicleStatusConfigs();
    return <VehicleStatusConfig configs={configs} />
}

export default async function VehicleStatusConfigPage() {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <VehicleStatusConfigDashboard />
        </Suspense>
    );
} 
