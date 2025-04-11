import { ShiftsPerVehicleDashboard } from "@/components/features/vehicles/calendar/shifts-per-vehicle-dashboard"

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