import { BaseModel } from '../../database/models';

export interface Booking extends BaseModel {
  booking_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_address: string;
  destination_address: string;
  pickup_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  vehicle_number?: string;
  driver_id?: string;
  total_passengers: number;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'refunded';
}
