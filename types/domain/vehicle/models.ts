import { BaseModel } from '@/types/database/models';

export interface Vehicle extends BaseModel {
  vehicle_number: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  is_active: boolean;
  branch_id: string;
}

export interface VehicleType extends BaseModel {
  name: string;
  description: string;
  capacity: number;
  is_active: boolean;
}
