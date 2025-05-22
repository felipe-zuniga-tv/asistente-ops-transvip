import { Branch } from "../admin";

export interface DateFields {
    creation_datetime: string;
    job_time: string;
    job_time_utc: string;
    temp_pickup_time: string;
    assignment_datetime: string;
    on_road_datetime: string;
    arrived_datetime: string;
    started_datetime: string;
    completed_datetime: string;
    no_show_datetime: string;
    cancellation_datetime: string;
}

export interface BookingDetails {
  id: string;
  driver_id: string;
  start_time: string;
  end_time: string;
  location: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Copied from types/domain/chat/models.ts
export interface IBookingInfo {
    job_id: number;
    job_status: number;
    type_of_trip: string;
    is_round_trip: number;
    estimated_payment_cost: number;
    branch: string; // Note: This was string, IBookingInfoOutput uses IBranch
    is_vip: number;
    payment_status: number;
    payment_method_name?: string;
    job_time: string;
    job_time_utc: string;
    fleet_first_name: string;
    fleet_last_name: string;
    fleet_country_code: string;
    fleet_phone_number: string;
    transport_details: string;
    unique_car_id: string;
    number_of_passangers: string;
    service_name: string;
    contract_name: string;
    customer_first_name: string;
    customer_last_name: string;
    customer_country_code: string;
    customer_phone_number: string;
    job_pickup_email: string;
    job_pickup_name: string;
    job_pickup_phone: string;
    booking_for: number;
    creation_datetime: string;
    job_pickup_address: string;
    job_address: string;
    eta: number;
    shared_service_id?: string;
}

export interface IBookingInfoOutput {
    booking: {
        id: number;
        status: number;
        type_of_trip: string;
        is_round_trip: boolean;
        pax_count: string;
        shared_service_id?: string;
        service_name: string;
        contract_name: string;
        booking_for: boolean;
        qr_link: string;
        observations?: string;
        no_show_reason?: string;
        no_show_identity?: string;
        creation_identity: string;
        assignment_identity: string;
        on_road_identity: string;
        arrived_identity: string;
        started_identity: string;
        ended_identity: string; // Assuming this meant ended, not completed from original DateFields
        cancellation_identity?: string;
        cancellation_reason?: string;
    };
    dates: DateFields; // Uses DateFields defined above
    branch?: Branch;
    directions: {
        origin: {
            address: string;
            latitude: string;
            longitude: string;
        };
        destination: {
            address: string;
            latitude: string;
            longitude: string;
        };
        estimated_travel_kms: number | null;
        estimated_travel_minutes: number | null;
        total_travel_kms: number | null;
        total_travel_minutes: number | null;
    };
    payment: {
        status: number;
        estimated_payment: number;
        actual_payment: number | null; // made actual_payment nullable
        method_name?: string;
        fare_route_name?: string;
        fare_route_type?: number;
    };
    fleet: {
        image: string;
        first_name: string;
        last_name: string;
        full_name: string;
        phone_number: string;
    };
    vehicle: {
        license_plate: string;
        vehicle_number: number | null;
        type?: string | null;
    };
    customer: {
        vip_flag: boolean;
        vip_label: string;
        first_name?: string;
        last_name?: string;
        full_name: string;
        phone_number: string;
        email: string;
    };
    rating?: {
        number: number;
        comment: string;
    };
} 