import { ShiftsPerVehicleDashboard } from "@/components/vehicle-shifts/calendar/shifts-per-vehicle-dashboard"

export default function DashboardPage() {
    return (
        <ShiftsPerVehicleDashboard 
            shifts={[]}
            daysToShow={30}
            vehicleNumber=""
            vehicleStatuses={[]}
        />
    )
}