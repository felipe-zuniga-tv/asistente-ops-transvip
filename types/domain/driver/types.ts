import type { Branch } from '@/types/domain/admin/types'; // Import Branch from admin

export interface Driver {
    id: string
    first_name: string
    last_name: string
    country_code: string
    phone: string
    branch_name: string
    is_active: boolean
    fleet_id: string
    fleet_thumb_image?: string
    // add additional fields as needed
}

export interface DriverRating {
    fleet_rating: number;
    fleet_comment: string;
}

// Copied from types/domain/chat/models.ts for IDriverProfile dependency
// Will be consolidated with admin/Branch later
// export interface IBranch {
//     branch_id: number;
//     name: string;
//     code: string;
// }

export interface IDriverVehicles {
    id: number,
    car_type: number,
    car_photo: string | undefined,
    registration_number: string,
    owner_id: number,
    owner_type: number,
    verification_status: number,
    verification_comment: string | undefined,
    working_status: number, // 1 - Activo
    modelity: number,
    unique_car_id: string,
    permission_of_circulation: string | undefined,
    is_deleted: number,
    car_name: string // Tipo de vehículo
}

export interface IDriverAssignedVehicles {
    active: boolean,
    license_plate: string, // Patente
    vehicle_type_name: string // Tipo de vehículo
    vehicle_number: number // Este sirve
}

// Fulfilled by IDriverProfile from types/domain/chat/models.ts
export interface DriverDetails { // Renamed from IDriverProfile
    id: number,
    created_at: string,
    last_login: string,
    branch: Branch, // Changed from IBranch to Branch
    current_license_plate: string,
    invoice_rut: string,
    personal: {
        first_name: string
        last_name: string
        full_name: string
        phone: string
        email: string
        image: string
    },
    status: {
        registration_status: number
        verification_status: number
        is_active: number
        is_available: number
        is_blocked: number
        is_blocked_gauss: number
        current: number
    },
    quality: {
        total_rating: number,
        rated_trips: number
        avg_rating: number
    },
    safety: {
        GaussControl: {
            id: number
            IBC: number
            NFA: number
            last_updated_at: string
            timezone: string
        }
    },
    driver_documents: {
        RUT: {
            number: number, // Assuming number, adjust if string
            image: string
        },
        license: {
            type: string,
            expiration_date?: string,
            image: string
        },
        life_sheet: {
            image: string
        },
        background: {
            image: string
        }
    }
    vehicles: IDriverVehicles[] // Uses IDriverVehicles defined above
    assigned_vehicles: IDriverAssignedVehicles[] // Uses IDriverAssignedVehicles defined above
}

export interface DriverSession {
    driver_id: number; // Corresponds to DriverDetails.id
    email: string;     // Corresponds to DriverDetails.personal.email
    full_name: string; // Corresponds to DriverDetails.personal.full_name
    expires: Date;
    // Any other session-specific properties
}

export interface CreateDriverSessionReturnType {
    session: DriverSession;
    encryptedSession: string;
}

export interface DriverOwnVehicle {
    registration_number: string;
    working_status?: number;
    unique_car_id: number;
    car_name: string;
}

export interface DriverAssignedVehicle {
    unique_car_id: string;
    car_name: string;
    car_number: string;
} 