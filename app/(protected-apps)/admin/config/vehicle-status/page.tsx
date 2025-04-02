import { getVehicleStatusConfigs } from "@/lib/services/database/actions";
import { VehicleStatusConfig } from "@/components/admin/vehicle-status/vehicle-status-config";

export const metadata = {
    title: "Configuración de Estados | Transvip",
    description: "Administra los estados disponibles para los vehículos",
};

export default async function VehicleStatusConfigPage() {
    const configs = await getVehicleStatusConfigs();
    return <VehicleStatusConfig configs={configs} />
}