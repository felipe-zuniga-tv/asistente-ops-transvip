"use server"

import { revalidatePath } from "next/cache"
import { parse } from "date-fns"
import { z } from "zod"
import { Routes } from "@/utils/routes"
import { createClient } from "@/lib/supabase/server"

import type { 
	ShiftData,
	VehicleShiftWithShiftInfo
} from './types'

const vehicleShiftSchema = z.object({
    vehicle_number: z.coerce.number().positive("El número debe ser positivo"),
    shift_id: z.string().uuid("Seleccione un turno válido"),
    start_date: z.coerce.date({
        required_error: "Se requiere una fecha de inicio",
    }),
    end_date: z.coerce.date({
        required_error: "Se requiere una fecha de fin",
    }),
    priority: z.coerce.number().min(1).max(100, "La prioridad debe estar entre 1 y 100"),
})

export async function createVehicleShift(formData: z.infer<typeof vehicleShiftSchema>) {
    const supabase = await createClient()

    try {
        const result = vehicleShiftSchema.safeParse(formData)
        if (!result.success) {
            return { error: "Datos inválidos" }
        }

        const { data: shift } = await supabase
            .from("shifts")
            .select("name")
            .eq("id", result.data.shift_id)
            .single()

        if (!shift) {
            return { error: "Turno no encontrado" }
        }

        const { error } = await supabase
            .from("vehicle_shifts")
            .insert({
                vehicle_number: result.data.vehicle_number,
                shift_id: result.data.shift_id,
                start_date: result.data.start_date,
                end_date: result.data.end_date,
                priority: result.data.priority,
            })

        if (error) throw error

        revalidatePath(Routes.CONTROL_FLOTA.VEHICLE_SHIFT)
        return { success: true }
    } catch (error) {
        console.error("Error creating vehicle shift:", error)
        return { error: "Error al crear la asignación" }
    }
}

export async function uploadVehicleShifts(csvContent: string, shifts: { id: string, name: string }[]) {
    const supabase = await createClient()
    
    const errors: { row: number; message: string }[] = []
    
    try {
        // Split CSV into lines and remove header
        const lines = csvContent.split("\n")
        const headers = lines[0].toLowerCase()
        const rows = lines.slice(1)

        // Validate headers
        const expectedHeaders = ["vehicle_number", "shift_name", "start_date", "end_date", "priority"]
        const headerArray = headers.split(",").map(h => h.trim())
        
        if (!expectedHeaders.every(h => headerArray.includes(h))) {
            return { 
                error: "El formato del archivo no es válido. Verifique las columnas requeridas." 
            }
        }

        const assignments = []

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i].trim()
            if (!row) continue

            const [vehicle_number, shift_name, start_date, end_date, priority] = row.split(",").map(field => field.trim())

            try {
                // Find shift by name
                const shift = shifts.find(s => s.name.toLowerCase() === shift_name.toLowerCase())
                if (!shift) {
                    errors.push({ row: i + 2, message: `Turno "${shift_name}" no encontrado` })
                    continue
                }

                // Parse and validate dates
                const parsedStartDate = parse(start_date, "yyyy-MM-dd", new Date())
                const parsedEndDate = parse(end_date, "yyyy-MM-dd", new Date())

                if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
                    errors.push({ row: i + 2, message: "Formato de fecha inválido. Use YYYY-MM-DD" })
                    continue
                }

                const assignment = {
                    vehicle_number: parseInt(vehicle_number),
                    shift_id: shift.id,
                    shift_name: shift.name,
                    start_date: parsedStartDate,
                    end_date: parsedEndDate,
                    priority: parseInt(priority),
                }

                // Validate using the schema
                const result = vehicleShiftSchema.safeParse({
                    ...assignment,
                    shift_id: shift.id,
                })

                if (!result.success) {
                    errors.push({ 
                        row: i + 2, 
                        message: "Datos inválidos en la fila" 
                    })
                    continue
                }

                assignments.push(assignment)
            } catch (error) {
                errors.push({ 
                    row: i + 2, 
                    message: "Error al procesar la fila" 
                })
            }
        }

        if (errors.length > 0) {
            return { errors }
        }

        // Insert all valid assignments
        const { error } = await supabase
            .from("vehicle_shifts")
            .insert(assignments)

        if (error) throw error

        revalidatePath(Routes.CONTROL_FLOTA.VEHICLE_SHIFT)
        return { success: true }
    } catch (error) {
        console.error("Error uploading vehicle shifts:", error)
        return { error: "Error al procesar el archivo" }
    }
}

export async function updateVehicleShift(
    id: string,
    formData: z.infer<typeof vehicleShiftSchema>
) {
    const supabase = await createClient()
    
    try {
        const result = vehicleShiftSchema.safeParse(formData)
        if (!result.success) {
            const errors = result.error.errors.map(e => e.message).join(", ")
            return { error: `Datos inválidos: ${errors}` }
        }

        // First check if the record exists
        const { data: existing } = await supabase
            .from("vehicle_shifts")
            .select("id")
            .eq("id", id)
            .single()

        if (!existing) {
            return { error: "Asignación no encontrada" }
        }

        const { data: shift } = await supabase
            .from("shifts")
            .select("name")
            .eq("id", result.data.shift_id)
            .single()

        if (!shift) {
            return { error: "Turno no encontrado" }
        }

        const { error } = await supabase
            .from("vehicle_shifts")
            .update({
                vehicle_number: result.data.vehicle_number,
                shift_id: result.data.shift_id,
                start_date: result.data.start_date,
                end_date: result.data.end_date,
                priority: result.data.priority,
            })
            .eq("id", id)

        if (error) {
            if (error.code === "23505") {
                return { error: "Ya existe una asignación para este vehículo en este período" }
            }
            throw error
        }

        revalidatePath(Routes.CONTROL_FLOTA.VEHICLE_SHIFT)
        return { success: true }
    } catch (error) {
        console.error("Error updating vehicle shift:", error)
        return { error: "Error al actualizar la asignación" }
    }
}

export async function deleteVehicleShift(id: string) {
    const supabase = await createClient()
    
    try {
        const { error } = await supabase
            .from("vehicle_shifts")
            .delete()
            .eq("id", id)

        if (error) throw error

        revalidatePath(Routes.CONTROL_FLOTA.VEHICLE_SHIFT)
        return { success: true }
    } catch (error) {
        console.error("Error deleting vehicle shift:", error)
        return { error: "Error al eliminar la asignación" }
    }
}

export async function bulkDeleteVehicleShifts(ids: string[]) {
    const supabase = await createClient()
    
    try {
        const { error } = await supabase
            .from("vehicle_shifts")
            .delete()
            .in("id", ids)

        if (error) throw error

        revalidatePath(Routes.CONTROL_FLOTA.VEHICLE_SHIFT)
        return { success: true }
    } catch (error) {
        console.error("Error deleting vehicle shifts:", error)
        return { error: "Error al eliminar las asignaciones" }
    }
}

export async function getShifts() {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('shifts')
		.select(`
			*,
			branches (
				id,
				name
			)
		`)
		.order('name', { ascending: true })

	if (error) throw new Error(error.message)
	revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
	
	return data.map(shift => ({
		id: shift.id,
		name: shift.name,
		start_time: shift.start_time,
		end_time: shift.end_time,
		free_day: shift.free_day,
		created_timestamp: shift.created_timestamp,
		branch_id: shift.branches?.id,
		branch_name: shift.branches?.name,
	}))
}

export async function getVehicleShifts(): Promise<VehicleShiftWithShiftInfo[]> {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('vehicle_shifts')
		.select(`
			*,
			shift_data:shifts (
				id,
				name,
				start_time,
				end_time,
				free_day,
				branches (
					id,
					name
				)
			)
		`)
		.order('vehicle_number', { ascending: true })

	if (error) throw new Error(error.message)
	
	return data.map(shift => ({
		id: shift.id,
		vehicle_number: shift.vehicle_number,
		shift_id: shift.shift_id,
		priority: shift.priority,
		created_at: shift.created_at,
		start_date: shift.start_date,
		end_date: shift.end_date,
		shift_name: shift.shift_data.name,
		shift_start_time: shift.shift_data.start_time,
		shift_end_time: shift.shift_data.end_time,
		shift_free_day: shift.shift_data.free_day,
		branch_id: shift.shift_data.branches?.id,
		branch_name: shift.shift_data.branches?.name,
	})) as VehicleShiftWithShiftInfo[]
}

export async function createShift(shiftData: Omit<ShiftData, 'branch_id'> & { branch_name: string }) {
	const supabase = await createClient()

	// Get branch_id from branch_name
	const { data: branchData, error: branchError } = await supabase
		.from('branches')
		.select('id')
		.ilike('name', shiftData.branch_name)
		.single()

	if (branchError) throw new Error(`Branch not found: ${shiftData.branch_name}`)

	const { branch_name, ...restData } = shiftData
	const shiftWithBranchId: ShiftData = {
		...restData,
		branch_id: branchData.id,
	}

	const { error } = await supabase
		.from('shifts')
		.insert([shiftWithBranchId])

	if (error) throw new Error(error.message)
	revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
}

export async function updateShift(id: string, shiftData: Partial<ShiftData>) {
	const supabase = await createClient()

	const { error } = await supabase
		.from('shifts')
		.update(shiftData)
		.eq('id', id)

	if (error) throw new Error(error.message)
	revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
}

export async function deleteShift(id: string) {
	const supabase = await createClient()

	const { error } = await supabase
		.from('shifts')
		.delete()
		.eq('id', id)

	if (error) throw new Error(error.message)
	revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
}

export async function getVehicleShiftsByDateRange(
	vehicleNumber: number,
	startDate: string,
	endDate: string,
	branchId?: string
) {
	try {
		const supabase = await createClient()

		let query = supabase
			.from("vehicle_shifts")
			.select(`
				*,
				shifts!inner (
					name,
					start_time,
					end_time,
					free_day,
					branch_id,
					branches (
						id,
						name
					)
				)
			`)
			.or(`start_date.lte.${endDate},end_date.gte.${startDate}`)

		// Only apply vehicle number filter if not 0
		if (vehicleNumber !== 0) {
			query = query.eq("vehicle_number", vehicleNumber)
		}

		// Only apply branch filter if provided
		if (branchId) {
			query = query.eq("shifts.branch_id", branchId)
		}

		const { data: vehicleShifts, error } = await query

		if (error) {
			console.error("Database error:", error)
			return { error: "Error fetching vehicle shifts" }
		}

		// Transform the data to include shift times
		const transformedShifts = vehicleShifts.map(shift => ({
			...shift,
			shift_name: shift.shifts?.name,
			start_time: shift.shifts?.start_time,
			end_time: shift.shifts?.end_time,
			free_day: shift.shifts?.free_day,
			branch_id: shift.shifts?.branches?.id,
			branch_name: shift.shifts?.branches?.name,
		}))

		revalidatePath(Routes.CONTROL_FLOTA.SHIFTS_PER_VEHICLE)
		return { data: transformedShifts }
	} catch (error) {
		console.error("Error in getVehicleShiftsByDateRange:", error)
		return { error: "Error fetching vehicle shifts" }
	}
}