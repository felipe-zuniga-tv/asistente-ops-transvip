// Payment Method Types
export interface PaymentMethod {
    id: string;
    name: string;
    code: string;
    payment_id: number;
    icon_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PaymentMethodFormValues {
    name: string;
    description: string;
    is_active: boolean;
}

// Vehicle Type Configuration
export interface VehicleType {
    id: string;
    name: string;
    code: string;
    passenger_capacity: number;
    luggage_capacity: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Branch Configuration
export interface Branch {
    id?: string;
    name: string;
    code: string;
    branch_id: number;
    sales_form_active: boolean;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

// Language Configuration for Admin CRUD
export interface Language {
    id: string;
    code: string;
    name: string;
    flag: string;
    region: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Translation {
    id: string;
    language_id: string;
    key: string;
    value: string;
    created_at: string;
    updated_at: string;
}

// Common input types for creation/updates
export type CreatePaymentMethodInput = Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>;
export type UpdatePaymentMethodInput = Partial<CreatePaymentMethodInput>;

export type CreateVehicleTypeInput = Omit<VehicleType, 'id' | 'created_at' | 'updated_at'>;
export type UpdateVehicleTypeInput = Partial<CreateVehicleTypeInput>;

export type CreateBranchInput = Omit<Branch, 'id' | 'created_at' | 'updated_at'>;
export type UpdateBranchInput = Partial<CreateBranchInput>;

export type CreateLanguageInput = Omit<Language, 'id' | 'created_at' | 'updated_at'>;
export type UpdateLanguageInput = Partial<CreateLanguageInput>;

export type CreateTranslationInput = Omit<Translation, 'id' | 'created_at' | 'updated_at'>;
export type UpdateTranslationInput = Partial<CreateTranslationInput>;

export interface UpdateSystemConfigInput {
	key: string;
	value: string;
	description?: string;
} 