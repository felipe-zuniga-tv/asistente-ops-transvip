import { Routes } from "@/utils/routes";
import { BarChart, CarFront, Gauge, PlaneTakeoff } from "lucide-react"

// Transvip Ops Teams
export const opsTeams = [
    {
      name: "Reclutamiento",
      logo: BarChart,
      plan: "Transvip",
    },
    {
      name: "Tráfico",
      logo: CarFront,
      plan: "Transvip",
    },
    {
      name: "Aeropuerto",
      logo: PlaneTakeoff,
      plan: "Transvip",
    },
    {
      name: "Calidad / Control Flota",
      logo: Gauge,
      plan: "Transvip",
    },
  ]


// Transvip Data configuration
export const branches = [
    { branch_id: 1, name: 'Santiago', code: 'SCL' },
    { branch_id: 798, name: 'Valparaiso', code: 'VAP' },
    { branch_id: 179, name: 'Calama', code: 'CJC' },
    { branch_id: 34, name: 'Antofagasta', code: 'ANF' },
]

export const paymentMethods = {
    CARD: 'Tarjeta de Credito o Debito',
    CREDIT_CARD: 'Tarjeta de Crédito',
    CREDIT_CARD_MP: 'Tarjeta de Crédito Mercadopago',
    FACTURA: 'Factura Credito',
    CASH: 'Efectivo Pesos',
}

// Airport Zones
export interface AirportZone {
    city_name: string;
    airport_code: string;
    branch_id: number;
    zone_id: number;
}

export const airportZones: AirportZone[] = [
    { city_name: 'Santiago', airport_code: 'SCL', branch_id: 1, zone_id: 2 },
    { city_name: 'Antofagasta', airport_code: 'ANF', branch_id: 34, zone_id: 3 },
]

export const airportTools = [
  { name: 'Zona Iluminada SCL', href: Routes.AIRPORT.ZI_SCL, active: true },
  { name: 'Zona Iluminada ANF', href: Routes.AIRPORT.ZI_ANF, active: true },
  { name: 'Zona Iluminada CJC', href: Routes.AIRPORT.ZI_SCL, active: false },
  { name: 'Crear código QR', href: '/qr', active: true },
  { name: 'Reservas Programadas', href: '#', active: false },
]; // Add more tools as needed
