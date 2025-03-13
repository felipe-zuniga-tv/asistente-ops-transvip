export interface DriverSession {
  driver_id: string
  email: string
  full_name: string
  vehicle_number: string
  expires: Date
}

export interface DriverDetails {
  id: string
  email: string
  full_name: string
  active: boolean
  created_at: string
  last_login?: string
  vehicle_number?: string
}
