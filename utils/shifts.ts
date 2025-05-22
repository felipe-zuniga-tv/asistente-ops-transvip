import { format } from "date-fns"
import { adjustDayIndex } from "./date"
import type { VehicleStatus } from "@/types/domain/vehicle/types"
import type { VehicleShiftWithShiftInfo, VehicleShiftWithFreeDay } from "@/types/domain/calendar/types"

export function getHighestPriorityShiftForDate(
    shifts: VehicleShiftWithShiftInfo[],
    date: Date,
    statuses?: VehicleStatus[]
): VehicleShiftWithFreeDay | undefined {
    const dateStr = format(date, "yyyy-MM-dd")
    const dayOfWeek = adjustDayIndex(date) + 1 // Convert to 1-7 range where Monday = 1

    // First check if there's a vehicle status for this date
    if (statuses?.length) {
        const status = statuses.find(status =>
            dateStr >= status.start_date &&
            dateStr <= status.end_date
        );

        if (status) {
            return {
                branch_id: status.branch_id || "",
                branch_name: status.branch_name || "",
                id: status.id,
                vehicle_number: Number(status.vehicle_number),
                shift_name: status.status_label,
                start_date: status.start_date,
                end_date: status.end_date,
                shift_id: status.status_id,
                priority: 100, // Status always takes precedence
                created_at: status.created_at,
                start_time: undefined,
                end_time: undefined,
                status_color: status.status_color,
                isStatus: true
            };
        }
    }

    // If no status, check for shifts
    const shift = shifts.find(shift =>
        dateStr >= shift.start_date &&
        dateStr <= shift.end_date
    )

    if (shift?.free_day === dayOfWeek) {
        return { ...shift, isFreeDay: true }
    }

    return shift
} 
