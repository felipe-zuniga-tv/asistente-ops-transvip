export interface PaymentMethod {
    id: string
    name: string
    code: string
    icon_name: string
    description: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface PaymentMethodFormData {
    name: string
    code: string
    icon_name: string
    description: string
    is_active: boolean
} 