// Base entity with common audit fields
export interface BaseAuditEntity {
  id: string; // uuid
  created_at: string; // timestamptz
  updated_at?: string; // timestamptz, optional for entities that don't update
}

// Represents a mining division or operational area
export interface Division extends BaseAuditEntity {
  name: string;
  contract_id?: string; // Optional: if divisions are tied to specific contracts
}

// Represents a driver
export interface Driver extends BaseAuditEntity {
  fleet_id: string; // Unique identifier for the driver within the fleet
  name: string; // Full name of the driver

  // New fields based on your requirements:
  branch_name?: string; // Sucursal
  driver_category?: string; // Categoria conductor
  employment_status?: string; // Estado (e.g., Active, Inactive, On Vacation)
  digital_folder_url?: string; // Carpeta digital (CONDUCTOR) - URL to the driver's digital folder
  national_id_number: string; // RUN - Chilean National ID number
  national_id_dv: string; // dv - Verification digit for RUN
  phone_contact?: string; // TELÉFONO CONDUCTOR
  email_contact?: string; // CORREO
  employer_rut?: string; // RUT EMPLEADOR - Employer's tax ID
  employer_name?: string; // EMPLEADOR - Employer's name
  national_id_card_expiry_date?: string; // timestamptz - Vencimiento CI
  occupational_exam_expiry_date?: string; // timestamptz - Examen Ocupacional (expiry date)
  psychotechnical_exam_expiry_date?: string; // timestamptz - Examen psico (expiry date)
  risk_aversion_test_expiry_date?: string; // timestamptz - Examen aversión al riesgo (expiry date)
  driving_license_expiry_date?: string; // timestamptz - Vencimiento licencia de conducir
  defensive_driving_course_expiry_date?: string; // timestamptz - Manejo a la defensiva (expiry date)
  new_hire_induction_expiry_date?: string; // timestamptz - Inducción hombre nuevo (expiry date or completion status)

  // Division-specific requirement expiry dates
  // These correspond to specific trainings/certifications for CODELCO divisions
  dch_odi_expiry_date?: string; // timestamptz - (División Chuquicamata - ODI)
  drt_plant_driving_expiry_date?: string; // timestamptz - (División Radomiro Tomic - Conducción planta)
  dmh_plant_driving_expiry_date?: string; // timestamptz - (División Ministro Hales - Conducción planta)
  dgm_driving_qualification_expiry_date?: string; // timestamptz - (División Gabriela Mistral - Conducción)

  overall_accreditation_status?: string; // Estado acreditación - Overall driver accreditation status
  notes?: string; // OBSERVACION - General notes or observations
}

// Represents a vehicle
export interface Vehicle extends BaseAuditEntity {
  vehicle_number: string; // Unique identifier for the vehicle
  make_model?: string; // e.g., 'Toyota Hilux'
}

// Represents the clearance status of a driver for a specific division
export interface DriverDivisionClearance extends BaseAuditEntity {
  driver_id: string; // uuid, FK to Driver
  division_id: string; // uuid, FK to Division
  is_cleared: boolean;
  status?: string; // e.g., 'Approved', 'Pending', 'Rejected', 'Expired'
  valid_from?: string; // timestamptz
  valid_until?: string; // timestamptz
  // updated_at is inherited from BaseAuditEntity
}

// Represents the clearance status of a vehicle for a specific division
export interface VehicleDivisionClearance extends BaseAuditEntity {
  vehicle_id: string; // uuid, FK to Vehicle
  division_id: string; // uuid, FK to Division
  is_cleared: boolean;
  status?: string; // e.g., 'Approved', 'Pending', 'Rejected', 'Expired'
  valid_from?: string; // timestamptz
  valid_until?: string; // timestamptz
  // updated_at is inherited from BaseAuditEntity
}

// Represents the assignment of a driver to a vehicle
export interface DriverVehicleAssignment extends BaseAuditEntity {
  driver_id: string; // uuid, FK to Driver
  vehicle_id: string; // uuid, FK to Vehicle
  assignment_start_date: string; // timestamptz
  assignment_end_date?: string; // timestamptz, optional
  is_active: boolean;
}

// Enriched types for UI display, if needed (example for drivers)
export interface DriverWithClearances extends Driver {
  clearances: Array<DriverDivisionClearance & { division_name?: string }>;
}

export interface VehicleWithClearances extends Vehicle {
  clearances: Array<VehicleDivisionClearance & { division_name?: string }>;
}

export interface FullAssignment extends DriverVehicleAssignment {
 driver: Driver;
 vehicle: Vehicle;
 driver_clearances: Array<DriverDivisionClearance & { division_name?: string }>;
 vehicle_clearances: Array<VehicleDivisionClearance & { division_name?: string }>;
} 