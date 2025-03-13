export interface Language {
  code: string;
  name: string;
}

export interface SalesResponse {
  id: string
  branch_code: string
  branch_name: string
  language: Language
  first_name: string
  last_name: string
  email: string
  phone_number: string
  return_date: string | null
  return_time: string | null
  accommodation: string
  created_at: string
  updated_at: string
  whatsapp_confirmed: boolean
  whatsapp_confirmed_at?: string
  whatsapp_confirmed_by?: string
  status: 'pending' | 'contacted' | 'confirmed' | 'cancelled'
  notes?: string
}

export interface CreateSalesResponse
  extends Omit<SalesResponse, 'id' | 'created_at' | 'updated_at' | 'status' | 'whatsapp_confirmed' | 'whatsapp_confirmed_at' | 'whatsapp_confirmed_by' | 'notes'> {
  status?: SalesResponse['status']
  whatsapp_confirmed?: boolean
} 