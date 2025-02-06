import { VehicleTypesConfig } from "@/components/admin/vehicle-types/vehicle-types-config";
import { getVehicleTypes } from "@/lib/services/admin/index"
import { Suspense } from "react";
import SuspenseLoading from "@/components/ui/suspense";

export const metadata = {
    title: 'Configuración de Tipos de Vehículos | Transvip',
    description: 'Administra los tipos de vehículos en Transvip',
}

export default async function VehicleTypesPage() {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <VehicleTypesConfigDashboard />
        </Suspense>
    );
}

async function VehicleTypesConfigDashboard() {
    const vehicleTypes = await getVehicleTypes();
    return <VehicleTypesConfig data={vehicleTypes} />
}