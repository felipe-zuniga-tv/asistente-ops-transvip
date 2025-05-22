import type { VehicleOnlineStatus } from "@/types/domain/vehicle/types";

export interface UseVehicleOnlineStatusReturn {
  vehicleOnlineStatusData: Map<number, VehicleOnlineStatus>;
  isLoadingOnlineStatus: boolean;
  onlineStatusError: string | null;
  fetchOnlineStatuses: (vehicleNumbers: number[]) => Promise<void>;
}

export interface UseVehicleShiftsProps {
  currentDate: Date;
  branchId?: string;
}

export interface UseVehicleCalendarDataProps {
  currentDate: Date;
  daysToShow: number;
  branchId?: string;
} 