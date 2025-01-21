import { VehicleShiftsDashboard } from "@/components/vehicle-shifts/dashboard/vehicle-shifts-dashboard"

export default function PublicDashboardShiftsPage() {
    return (
        <div className="p-3 max-w-4xl mx-auto pt-10">
            <VehicleShiftsDashboard daysToShow={30} />
        </div>
    )
}