import { Database } from './schema';

// Extract Row types from the Database schema
export type SystemConfig = Database['public']['Tables']['system_configs']['Row'];

// Common database model interfaces
export interface BaseModel {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface AuditableModel extends BaseModel {
  created_by?: string;
  updated_by?: string;
}
