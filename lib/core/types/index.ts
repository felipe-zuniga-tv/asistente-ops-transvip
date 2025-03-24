// Export all types
export * from './chat';
export * from './admin';
export * from './vehicle/status';
export * from './vehicle/shift';
export * from './airport';
export * from './sales';

// Define Session type if not already defined
export interface Session {
  user: {
    full_name: string;
    email: string;
    accessToken?: string;
  };
}

// Define Tool interface
import { LucideIcon } from "lucide-react";
export interface Tool {
  title: string;
  active?: boolean;
  hint?: string;
  search?: string;
  icon?: LucideIcon;
  url?: string;
}

// Vehicle Types
export * from './vehicle/status';
export * from './vehicle/shift'; 