import { getShifts, getVehicleShifts } from "@/lib/services/database/actions"
import { VehicleShifts } from "@/components/features/vehicles/vehicle-shifts"

export default async function VehicleShiftsPage() {
    const shifts = await getShifts()
    const vehicleShifts = await getVehicleShifts()

    return <VehicleShifts shifts={shifts} vehicleShifts={vehicleShifts || []} />
}