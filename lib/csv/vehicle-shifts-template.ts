import { format } from "date-fns"

export const VEHICLE_SHIFTS_CSV_HEADERS = [
    "vehicle_number",
    "shift_name",
    "start_date",
    "end_date",
    "priority"
]

export function generateVehicleShiftsTemplate() {
    const headers = VEHICLE_SHIFTS_CSV_HEADERS.join(",")
    const example = [
        123,                    // vehicle_number
        "Turno Mañana",        // shift_name
        format(new Date(), "yyyy-MM-dd"), // start_date
        format(new Date(), "yyyy-MM-dd"), // end_date
        1                      // priority
    ].join(",")
    
    return `${headers}\n${example}`
}