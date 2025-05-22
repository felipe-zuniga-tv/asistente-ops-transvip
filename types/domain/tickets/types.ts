export interface ParkingTicket {
  id: string; // uuid
  booking_id: string;
  driver_id: string;
  submission_date: string; // ISO 8601 timestamp
  status: 'pending_review' | 'auto_approved' | 'auto_rejected' | 'admin_approved' | 'admin_rejected';
  parsed_data: Record<string, any>; // Or a more specific type if you know the structure of parsed_data
  created_at: string; // ISO 8601 timestamp
  vehicle_number?: string | null;
} 

export interface ParsedTicketData {
  nro_boleta: string;
  entry_date: string;
  entry_time: string;
  exit_date: string;
  exit_time: string;
  amount: number;
  location: string;
}

// From lib/features/tickets/index.ts
export interface BookingValidation {
  isValid: boolean;
  error?: string;
} 