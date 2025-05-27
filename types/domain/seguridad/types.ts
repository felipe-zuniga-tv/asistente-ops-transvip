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