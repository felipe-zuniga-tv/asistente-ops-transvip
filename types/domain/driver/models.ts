export interface DriverSession {
  driver_id: string
  email: string
  full_name: string
  expires: Date
}

export interface DriverDetails {
  fleet_id: string
  email: string
  first_name: string
  last_name: string
  active: boolean
  created_at: string
  last_login?: string
  vehicle_number?: string
}
