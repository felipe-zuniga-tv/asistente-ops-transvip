import type { VehicleShift } from "@/types/domain/shifts/types";
import type { VehicleStatusInfo } from "@/types/domain/vehicle/types";

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

export interface ShiftSummaryVehicle {
    number: number;
    shiftName: string;
    startTime?: string;
    endTime?: string;
    isOnline?: boolean;
}

export interface ShiftSummary {
    date: string;
    vehicles: ShiftSummaryVehicle[];
}

export interface CalendarMonth {
    date: Date;
    days: Date[];
}

// From hooks/features/vehicles/use-vehicle-calendar-data.ts
// export interface VehicleStatusInfoForCalendar { // Removed, will import VehicleStatusInfo
//   id: string;
//   label: string;
//   color?: string;
// }

export interface VehicleCalendarEntry {
  number: number;
  shiftName?: string;
  startTime?: string;
  endTime?: string;
  statusInfo?: VehicleStatusInfo; // Use imported VehicleStatusInfo
  isOnline?: boolean;
  anexo_2_signed?: boolean;
  lastOnlineStatusUpdate?: number;
}

export interface CalendarDaySummary {
  date: string;
  vehicles: VehicleCalendarEntry[];
} 