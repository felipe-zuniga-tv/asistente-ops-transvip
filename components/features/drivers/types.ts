export interface Driver {
  id: string
  first_name: string
  last_name: string
  country_code: string
  phone: string
  branch_name: string
  is_active: boolean
  fleet_id: string
  fleet_thumb_image?: string
  // add additional fields as needed
} 