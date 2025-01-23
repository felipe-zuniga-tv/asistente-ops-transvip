export interface Terminal {
    id: string;
    name: string;
}

export interface PassengerData {
    name: string;
    phone: string;
    email: string;
    destination: string;
}

export interface Vehicle {
    id: string;
    number: string;
    driver: {
        name: string;
        phone: string;
    };
    status: string;
    lastLocation?: {
        lat: number;
        lng: number;
        timestamp: string;
    };
}

export interface ZarpeLocation {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

export interface ZarpePassenger {
    id: string;
    name: string;
    phone: string;
    destination: string;
    timestamp: string;
}

export interface AirportZone {
    id: string;
    name: string;
    code: string;
    description?: string;
}

export interface AirportVehicleType {
    id: number[]
    count: number
    vehicle_image: string
    name: string
}

export interface AirportVehicleDetail {
    unique_car_id: string
    tipo_contrato: string
    name: string
    action: number
    fleet_id: number
    fleet_name: string
    entry_time: string
    total_passengers: number
    passenger_entry_time: string
} 