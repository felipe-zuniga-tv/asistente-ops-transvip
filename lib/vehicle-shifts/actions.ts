'use server'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { Routes } from "@/utils/routes"

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
                    end_time,
                    free_day
                )
            `)
            .eq("vehicle_number", vehicleNumber)
            .or(`start_date.gte.${startDate}, end_date.lte.${endDate}`)
            .order("priority", { ascending: false })

        if (error) {
            return { error: "Error fetching vehicle shifts" }
        }

        // Transform the data to include shift times
        const transformedShifts = vehicleShifts.map(shift => ({
            ...shift,
            start_time: shift.shifts?.start_time,
            end_time: shift.shifts?.end_time,
            free_day: shift.shifts?.free_day,
            shifts: undefined // Remove the nested shifts object
        }))

        revalidatePath(Routes.CONTROL_FLOTA.DASHBOARD)
        return { data: transformedShifts }
    } catch (error) {
        return { error: "Error fetching vehicle shifts" }
    }
} 