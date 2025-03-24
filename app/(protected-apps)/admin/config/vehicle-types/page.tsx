import { Suspense } from "react";
import { VehicleTypesConfig } from "@/components/admin/vehicle-types/vehicle-types-config";
import { getVehicleTypes } from "@/lib/services/admin/index"
import SuspenseLoading from "@/components/ui/suspense";

export const metadata = {
    title: 'Configuración de Tipos de Vehículos | Transvip',
    description: 'Administra los tipos de vehículos en Transvip',
}

async function VehicleTypesConfigDashboard() {
    const vehicleTypes = await getVehicleTypes();
    return <VehicleTypesConfig data={vehicleTypes} />
}

export default async function VehicleTypesPage() {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <VehicleTypesConfigDashboard />
        </Suspense>
    );
}