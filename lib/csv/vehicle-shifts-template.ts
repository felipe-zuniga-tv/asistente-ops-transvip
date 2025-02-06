import { addDays, format } from "date-fns"

export const VEHICLE_SHIFTS_CSV_HEADERS = [
    "Móvil",
    "Sucursal",
    "Nombre Turno",
    "Fecha Inicio",
    "Fecha Fin",
    "Prioridad"
]

export function generateVehicleShiftsTemplate() {
    const headers = VEHICLE_SHIFTS_CSV_HEADERS.join(",")
    const example = [
        123,                    // vehicle_number
        "Santiago",             // branch_name
        "Turno Mañana",        // shift_name
        format(new Date(), "yyyy-MM-dd"), // start_date
        format(addDays(new Date(), 10), "yyyy-MM-dd"), // end_date
        1                      // priority
    ].join(",")
    
    return `${headers}\n${example}`
}