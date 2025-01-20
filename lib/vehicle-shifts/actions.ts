'use server'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function getVehicleShiftsByDateRange(
    vehicleNumber: number,
    startDate: string,
    endDate: string
) {
    try {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        const { data: vehicleShifts, error } = await supabase
            .from("vehicle_shifts")
            .select(`
                *,
                shifts (
                    start_time,
                    end_time
                )
            `)
            .eq("vehicle_number", vehicleNumber)
            .gte("start_date", startDate)
            .lte("end_date", endDate)
            .order("priority", { ascending: false })

        if (error) {
            return { error: "Error fetching vehicle shifts" }
        }

        // Transform the data to include shift times
        const transformedShifts = vehicleShifts.map(shift => ({
            ...shift,
            start_time: shift.shifts?.start_time,
            end_time: shift.shifts?.end_time,
            shifts: undefined // Remove the nested shifts object
        }))

        revalidatePath("/control-flota/dashboard")
        return { data: transformedShifts }
    } catch (error) {
        return { error: "Error fetching vehicle shifts" }
    }
} 