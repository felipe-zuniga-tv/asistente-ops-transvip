export interface DriverSession {
  driver_id: string
  email: string
  full_name: string
  vehicle_number: string
  expires: Date
}

export interface ParkingTicket {
  id: string
  booking_id: string
  driver_id: string
  vehicle_number: string | null
  submission_date: Date
  status: 'pending_review' | 'auto_approved' | 'auto_rejected' | 'admin_approved' | 'admin_rejected'
  parsed_data: {
    nro_boleta: string
    entry_date: string
    entry_time: string
    exit_date: string
    exit_time: string
    amount: number
    location: string
    image_url: string
  }
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