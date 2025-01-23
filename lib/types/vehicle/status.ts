export interface VehicleStatusConfig {
    id: string;
    label: string;
    description: string | null;
    color: string;
    created_at: string;
}

export interface VehicleStatus {
    id: string;
    vehicle_number: number;
    status_id: string;
    status_label: string;
    status_color: string;
    start_date: string;
    end_date: string;
    comments: string | null;
    created_at: string;
    created_by: string | null;
}

export interface CreateVehicleStatusInput {
    vehicle_number: string;
    status_id: string;
    start_date: string;
    end_date: string;
    comments?: string;
    created_by?: string;
} 