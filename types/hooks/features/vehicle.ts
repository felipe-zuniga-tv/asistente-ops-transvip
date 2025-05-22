import type { VehicleOnlineStatus } from "@/types/domain/vehicle/types";
import type { UseVehicleOnlineStatusReturn } from "@/types/hooks/features/vehicle";

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