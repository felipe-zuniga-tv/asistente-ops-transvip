export {};

export interface VehicleDetails {
  plateNumber: string;
  rntEntryDate: string;
  serviceType: string;
  capacity: string;
  vehicleStatus: string;
  region: string;
  manufacturingYear: string;
  seatbeltRequired: string;
  vehicleAge: string;
  brand: string;
  model: string;
}

export interface ServiceDetails {
  serviceId: string;
  associatedFleet: string;
  serviceResponsible: string;
  serviceStatus: string;
}

export interface ParsedMTTResponse {
  status: "ENCONTRADO" | "NO_ENCONTRADO" | "ERROR_PARSING";
  details?: {
    displayLabels: { [key: string]: string };
    data: {
      licensePlate?: string;
      serviceType?: string;
      vehicleStatus?: string;
      region?: string;
      manufacturingInfo?: string;
      vehicleModel?: string;
      serviceStatus?: string;
      serviceInfo?: string;
      serviceFleet?: string;
      responsible?: string;
      regulation?: string;
      message?: string;
    };
  };
}

export interface MTTVehicleInfo {
  licensePlate: string;
  status: string;
  lastUpdate: string;
  details?: ParsedMTTResponse['details'];
  error?: string;
} 