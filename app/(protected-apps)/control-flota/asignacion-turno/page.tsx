import { Suspense } from "react"
import { VehicleShifts } from "@/components/vehicle-shifts/vehicle-shifts"
import { getShifts, getVehicleShifts } from "@/lib/services/database/actions"
import SuspenseLoading from "@/components/ui/suspense"

async function VehicleShiftsPageContent() {
    const shifts = await getShifts()
    const vehicleShifts = await getVehicleShifts()

    return <VehicleShifts shifts={shifts} vehicleShifts={vehicleShifts || []} />
}

export default async function VehicleShiftsPage() {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <VehicleShiftsPageContent />
        </Suspense>
    )
}