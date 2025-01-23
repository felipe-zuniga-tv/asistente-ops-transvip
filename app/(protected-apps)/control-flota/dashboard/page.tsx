import { VehicleShiftsDashboard } from "@/components/vehicle-shifts/dashboard/vehicle-shifts-dashboard"
import { getVehicleShifts } from "@/lib/database/actions"
import { getVehicleStatusesForCalendar } from "@/lib/database/actions"
import { format, addDays } from "date-fns"

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const vehicleNumber = searchParams.vehicle_number as string
    const daysToShow = parseInt(searchParams.days_to_show as string) || 30

    const shifts = vehicleNumber ? await getVehicleShifts() : []

    // Fetch vehicle statuses if a vehicle number is provided
    const vehicleStatuses = vehicleNumber ? await getVehicleStatusesForCalendar(
        vehicleNumber,
        format(new Date(), 'yyyy-MM-dd'),
        format(addDays(new Date(), daysToShow), 'yyyy-MM-dd')
    ) : []

    return (
        <VehicleShiftsDashboard
            shifts={shifts}
            daysToShow={daysToShow}
            vehicleNumber={vehicleNumber}
            vehicleStatuses={vehicleStatuses}
        />
    )
}