import { VehicleShifts } from "@/components/vehicle-shifts/vehicle-shifts"
import { getShifts, getVehicleShifts } from "@/lib/database/actions"

export default async function VehicleShiftsPage() {
    const shifts = await getShifts()
    const vehicleShifts = await getVehicleShifts()
    
    return (
        <VehicleShifts 
            shifts={shifts} 
            vehicleShifts={vehicleShifts || []}
        />
    )
}