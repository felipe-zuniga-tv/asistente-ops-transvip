import { VehicleShiftsDashboard } from "@/components/vehicle-shifts/dashboard/vehicle-shifts-dashboard"

export default function DashboardPage() {
    return (
        <VehicleShiftsDashboard 
            shifts={[]}
            daysToShow={30}
            vehicleNumber=""
            vehicleStatuses={[]}
        />
    )
}