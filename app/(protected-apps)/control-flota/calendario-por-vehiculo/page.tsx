import { ShiftsPerVehicleDashboard } from "@/components/features/vehicle-shifts/per-vehicle/calendar/shifts-per-vehicle-dashboard"

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