import { Routes } from "@/utils/routes";
import type { BranchAirportZone } from "@/types/domain/airport/types";

// Airport Zones
export const airportZones: BranchAirportZone[] = [
  { city_name: 'Santiago', airport_code: 'SCL', branch_id: 1, zone_id: 2 },
  { city_name: 'Antofagasta', airport_code: 'ANF', branch_id: 34, zone_id: 3 },
]

export const airportTools = [
  { name: 'Zona Iluminada SCL', href: Routes.AIRPORT.ZI_SCL, active: true },
  { name: 'Zona Iluminada ANF', href: Routes.AIRPORT.ZI_ANF, active: true },
  { name: 'Zona Iluminada CJC', href: Routes.AIRPORT.ZI_CJC, active: true },
  { name: 'Chatbot Operaciones', href: Routes.CHAT, active: true },
  { name: 'Crear código QR', href: Routes.QR_GEN, active: false },
  { name: 'Reservas Programadas', href: '#', active: false },
]; // Add more tools as needed
