import { BarChart, CarFront, Gauge, PlaneTakeoff, Coins, CreditCard, ReceiptText } from "lucide-react"

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

export const paymentMethods = [
  { key: 'CARD', name: 'Tarjeta de Credito o Debito', id: 4, icon: CreditCard },
  { key: 'CREDIT_CARD', name: 'Tarjeta de Crédito', id: 10, icon: CreditCard },
  { key: 'CREDIT_CARD_MP', name: 'Tarjeta de Crédito Mercadopago', id: 15, icon: CreditCard },
  { key: 'CARD_TOTEM', name: 'Tarjeta de crédito/débito tótem', id: 18, icon: CreditCard },
  { key: 'FACTURA', name: 'Factura Credito', icon: ReceiptText },
  { key: 'CASH', name: 'Efectivo Pesos', id: 3, icon: Coins },
]

export const vehicleTypes = [
  { id: 1, name: 'Sedan' },
  { id: 2, name: 'Minibus' },
  { id: 6, name: 'Minibus*' },
  { id: 19, name: 'Sedan P' },
  { id: 21, name: 'Taxi Básico' },
]