import { getVehicleTypes } from "@/lib/services/admin/index"
import { VehicleTypesConfig } from "@/components/admin/vehicle-types/vehicle-types-config";

export const metadata = {
    title: 'Configuración de Tipos de Vehículos | Transvip',
    description: 'Administra los tipos de vehículos en Transvip',
}

export default async function VehicleTypesPage() {
    const vehicleTypes = await getVehicleTypes();
    return <VehicleTypesConfig data={vehicleTypes} />
}