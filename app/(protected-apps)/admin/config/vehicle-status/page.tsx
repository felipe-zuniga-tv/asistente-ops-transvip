import { getVehicleStatusConfigs } from "@/lib/features/vehicle-status";
import { VehicleStatusConfig } from "@/components/features/admin/vehicle-status/vehicle-status-config";

export const metadata = {
    title: "Configuración de Estados | Transvip",
    description: "Administra los estados disponibles para los vehículos",
};

export default async function VehicleStatusConfigPage() {
    const configs = await getVehicleStatusConfigs();
    return <VehicleStatusConfig configs={configs} />
}