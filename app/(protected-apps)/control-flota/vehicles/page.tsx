import { VehicleShiftsContent } from "@/components/vehicle-shifts/vehicle-shifts-content"
import { getShifts, getVehicleShifts } from "@/lib/database/actions"

export default async function VehicleShiftsPage() {
    const shifts = await getShifts()
    const vehicleShifts = await getVehicleShifts()
    
    return (
        <VehicleShiftsContent 
            shifts={shifts} 
            vehicleShifts={vehicleShifts || []}
        />
    )
}