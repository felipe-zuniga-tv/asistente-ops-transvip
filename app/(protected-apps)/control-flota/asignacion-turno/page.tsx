import { Suspense } from "react"
import { VehicleShifts } from "@/components/vehicle-shifts/vehicle-shifts"
import { getShifts, getVehicleShifts } from "@/lib/database/actions"
import SuspenseLoading from "@/components/ui/suspense"

export default async function VehicleShiftsPage() {
    const shifts = await getShifts()
    const vehicleShifts = await getVehicleShifts()
    
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <VehicleShifts 
                shifts={shifts} 
                vehicleShifts={vehicleShifts || []}
            />
        </Suspense>
    )
}