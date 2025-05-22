export {};

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