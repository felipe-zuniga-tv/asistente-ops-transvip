export interface VehicleShift {
    id: string;
    vehicle_number: number;
    shift_name: string;
    shift_id: string;
    branch_id: string;
    branch_name: string;
    start_date: string;
    end_date: string;
    start_time?: string;
    end_time?: string;
    priority: number;
    anexo_2_signed?: boolean;
}

export interface VehicleShiftWithShiftInfo extends VehicleShift {
    free_day?: number;
    status_color?: string;
    isStatus?: boolean;
    created_at: string;
}

export interface VehicleShiftWithFreeDay extends VehicleShiftWithShiftInfo {
    isFreeDay?: boolean;
    isStatus?: boolean;
    status_color?: string;
}

export interface ShiftData {
    id?: string;
    branch_id: string;
    name: string;
    start_time: string;
    end_time: string;
    free_day: number;
    created_timestamp?: string;
    anexo_2_signed: boolean;
} 