export interface VehicleStatusConfig {
    id: string;
    label: string;
    description: string | null;
    color: string;
    created_at: string;
}

export interface VehicleStatus {
    id: string;
    vehicle_number: string;
    status_id: string;
    status_label: string;
    status_color: string;
    start_date: string;
    end_date: string;
    comments: string | null;
    created_at: string;
    created_by: string | null;
    updated_by?: string | null;
    is_active?: boolean;
    branch_id?: string;
    branch_name?: string;
}

// From hooks/features/vehicles/use-vehicle-status.ts
export type CreateVehicleStatusInput = Omit<VehicleStatus, 'id' | 'created_at' | 'updated_at' | 'status_label' | 'status_color'> & {
  // Comments may need specific handling if API expects undefined vs null
};

export type UpdateVehicleStatusInput = Partial<Omit<VehicleStatus, 'id' | 'created_at' | 'updated_at' | 'status_label' | 'status_color'>
> & { vehicle_id?: string | number }; // vehicle_id might be part of update payload

// Copied from types/domain/chat/models.ts
import type { Branch } from '@/types/domain/admin/types'; // Changed from IBranch from driver/types
import type { AllowedCarName } from "@/utils/constants"; // Added import

export interface IVehicleStatusSearchResult {
    vehicle_number: string;
    message: string;
    status: number; // 0 - Online Free / 1 - Online Busy / Nada: offline
    fleet_id: number;
    email: string;
    first_name: string;
    last_name: string;
    driver_name: string;
    phone_number: string;
    fleet_image: string;
    is_active: number;
    is_available: number;
    license_plate: string;
    job_id?: number;
    pax_count: number;
    branch: Branch;
    contract_name: string;
    service_name: string;
    vehicle_image: string;
}

export interface IVehicleDetailDrivers {
    driver_id: number;
    full_name: string;
}

export interface IVehicleDetail {
    vehicle_number: number;
    license_plate: string;
    branch: Branch;
    status: number;
    drivers: IVehicleDetailDrivers[];
    creation_datetime: string;
    owner: {
        id: number;
        fleet_id: number;
        first_name: string;
        last_name: string;
    };
    documents: {
        registration_image: string;
        permission_of_circulation: string;
        transportation_permit: string;
        travel_card_key: string;
        passenger_insurance_key: string;
    };
    verification: {
        status: number;
        comment: string;
    };
    contract: {
        type: string;
        society_name: string;
    };
    type: {
        id: number;
        name: string;
    };
    model: {
        id: number;
        name: string;
    };
    color: {
        id: number;
        name: string;
        code: string;
    };
}

// From lib/services/vehicle/list.ts - For vehicle select/list UI
export interface VehicleSelectItem {
    value: string;
    label: string;
    type: AllowedCarName;
}

export interface VehicleOnlineStatus {
  isOnline?: boolean;
  timestamp: number;
  error?: string | null;
}

export interface VehicleStatusInfo {
  id: string;
  label: string;
  color?: string;
} 