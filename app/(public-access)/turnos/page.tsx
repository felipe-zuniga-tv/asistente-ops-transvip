import { ShiftsPerVehicleDashboard } from "@/components/vehicle-shifts/calendar/shifts-per-vehicle-dashboard"

export default function PublicDashboardShiftsPage() {
    return (
        <div className="p-3 max-w-4xl mx-auto pt-10">
            <ShiftsPerVehicleDashboard 
                daysToShow={30} 
                shifts={[]}
                vehicleStatuses={[]}
            />
        </div>
    )
}