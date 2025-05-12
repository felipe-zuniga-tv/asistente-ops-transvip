import { ShiftsPerVehicleDashboard } from "@/components/features/vehicles/calendar/shifts-per-vehicle-dashboard"

export default function PublicDashboardShiftsPage() {
    return (
        <div className="p-3 pt-6 bg-gray-100 min-h-screen">
            <ShiftsPerVehicleDashboard 
                daysToShow={30} 
                shifts={[]}
                vehicleStatuses={[]}
                className="max-w-6xl mx-auto flex-1"
            />
        </div>
    )
}