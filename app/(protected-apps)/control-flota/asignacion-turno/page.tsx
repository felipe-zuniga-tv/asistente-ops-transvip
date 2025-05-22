import { getShifts, getVehicleShifts } from "@/lib/features/vehicle-shifts"
import { VehicleShifts } from "@/components/features/vehicle-shifts/per-vehicle/vehicle-shifts"

export default async function VehicleShiftsPage() {
    const shifts = await getShifts()
    const vehicleShifts = await getVehicleShifts()

    return <VehicleShifts shifts={shifts} vehicleShifts={vehicleShifts || []} />
}