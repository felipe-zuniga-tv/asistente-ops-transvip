'use server'

import { createClient } from '@/lib/supabase/server'
import type { 
	ShiftData, 
	VehicleShiftWithShiftInfo
} from '@/lib/core/types'

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
	// revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
	
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

// SHIFTS
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
	// revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
}

export async function updateShift(id: string, shiftData: Partial<ShiftData>) {
	const supabase = await createClient()

	const { error } = await supabase
		.from('shifts')
		.update(shiftData)
		.eq('id', id)

	if (error) throw new Error(error.message)
	// revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
}

export async function deleteShift(id: string) {
	const supabase = await createClient()

	const { error } = await supabase
		.from('shifts')
		.delete()
		.eq('id', id)

	if (error) throw new Error(error.message)
	// revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
}

// VEHICLE SHIFTS
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

		// revalidatePath(Routes.CONTROL_FLOTA.SHIFTS_PER_VEHICLE)
		return { data: transformedShifts }
	} catch (error) {
		console.error("Error in getVehicleShiftsByDateRange:", error)
		return { error: "Error fetching vehicle shifts" }
	}
}