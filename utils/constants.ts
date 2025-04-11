// Vehicle status constants
export const VEHICLE_STATUS = {
  OFFLINE: 0,
  ONLINE: 1,
  ONLINE_BUSY: 1,
  ONLINE_AVAILABLE: 2,
} as const 

export const ALLOWED_VEHICLE_NAMES_PARKING_TICKETS = ['Sedan', 'Minibus']
export type AllowedCarName = typeof ALLOWED_VEHICLE_NAMES_PARKING_TICKETS[number] 