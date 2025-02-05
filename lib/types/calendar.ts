import { VehicleShift, VehicleStatus } from "@/lib/types"

export interface VehicleShiftWithShiftInfo extends VehicleShift {
    free_day?: number;
    status_color?: string;
    isStatus?: boolean;
    shift_id: string;
    priority: number;
    created_at: string;
}

export interface VehicleShiftWithFreeDay extends VehicleShiftWithShiftInfo {
    isFreeDay?: boolean;
    isStatus?: boolean;
    status_color?: string;
}

export interface ShiftSummary {
    date: string
    vehicles: {
        number: number
        shiftName: string
        startTime?: string
        endTime?: string
    }[]
}

export interface CalendarMonth {
    date: Date
    days: Date[]
} 