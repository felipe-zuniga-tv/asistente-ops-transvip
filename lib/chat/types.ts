// DATA TYPES
export interface BranchProps {
    branch_id: number;
    name: string;
    code: string;
}
export interface VehicleStatusSearchResultProps {
    vehicle_number: string;
    message: string;
    status: number
    // 0 - Online Free / 1 - Online Busy / Nada: offline
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
    branch: BranchProps;
    contract_name: string;
    service_name: string;
    vehicle_image: string
}
export interface BookingInfoProps {
    job_id: number
    job_status: number
    type_of_trip: string
    is_round_trip: number
    estimated_payment_cost: number
    branch: string,
    is_VIP: number
    payment_status: number
    payment_method_name?: string
    job_time: string
    job_time_utc: string
    fleet_first_name: string
    fleet_last_name: string
    fleet_country_code: string
    fleet_phone_number: string
    transport_details: string
    unique_car_id: string
    number_of_passangers: string
    service_name: string
    contract_name: string
    customer_first_name: string
    customer_last_name: string
    customer_country_code: string
    customer_phone_number: string
    job_pickup_email: string
    job_pickup_name: string
    job_pickup_phone: string
    booking_for: number
    creation_datetime: string
    job_pickup_address: string
    job_address: string
    eta: number,
    shared_service_id: string | undefined
}
export interface BookingInfoOutputProps {
    booking: {
        id: number
        status: number
        type_of_trip: string
        is_round_trip: number
        pax_count: string
        job_time: string
        job_time_utc: string
        creation_datetime: string
        shared_service_id: string | undefined
        service_name: string
        contract_name: string
        booking_for: boolean
        qr_link: string
        assignment_identity: string
    }
    branch: BranchProps | undefined
    directions: {
        origin: string
        destination: string
        estimated_travel_time: number
        total_travel_kms: number
        total_travel_minutes: number
    }
    payment: {
        status: number
        estimated_payment: number
        method_name?: string
    }
    fleet: {
        image: string
        first_name: string
        last_name: string
        full_name: string
        phone_number: string
    }
    vehicle: {
        license_plate: string
        vehicle_number: number
        type?: string
    }
    customer: {
        vip_flag: boolean
        first_name?: string
        last_name?: string
        full_name: string
        phone_number: string
        email: string
    };
}
export interface VehicleDetailProps {
    vehicle_number: number,
    license_plate: string,
    branch: BranchProps,
    status: number,
    drivers: VehicleDetailDriversProps[],
    creation_datetime: string,
    owner: {
        id: number,
        fleet_id: number,
        first_name: string,
        last_name: string,
    },
    documents: {
        registration_image: string,
        permission_of_circulation: string,
        transportation_permit: string,
        travel_card_key: string,
        passenger_insurance_key: string
    },
    verification: {
        status: number,
        comment: string
    },
    contract: {
        type: string,
        society_name: string,
    },
    type: {
        id: number,
        name: string
    },
    model: {
        id: number,
        name: string,
    },
    color: {
        id: number,
        name: string,
        code: string,
    }
}
export interface VehicleDetailDriversProps {
    fleet_id: number,
    first_name: string
    last_name: string,
    country_code: string,
    phone: string
}

// Drivers
export interface DriverVehiclesProps {
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
export interface DriverAssignedVehiclesProps {
    mapping_id: number, // No se utiliza
    status: number, // 1 - Activo?
    car_number: string, // Patente
    car_type: number, // No sirve?
    fleet_id: number,
    fleet_first_name: string,
    fleet_last_name: string,
    added_date_time: string, // Fecha de agregar el vehículo
    car_id: number,
    is_deleted: number,
    unique_car_id: string, // Este sirve
    car_name: string // Tipo de vehículo
}
export interface DriverProfileProps {
    id: number,
    created_at: string,
    last_login: string,
    branch: BranchProps,
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
            number: number,
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
    vehicles: DriverVehiclesProps[]
    assigned_cars: DriverAssignedVehiclesProps[]
}