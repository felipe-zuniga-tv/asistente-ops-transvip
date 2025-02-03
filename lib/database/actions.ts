'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Routes } from '@/utils/routes'
import type { 
	ShiftData, 
	VehicleStatus, 
	VehicleStatusConfig, 
	CreateVehicleStatusInput,
	VehicleShift,
	VehicleShiftWithShiftInfo
} from '@/lib/types'

export async function getSupabaseClient() {
	const cookieStore = cookies()
	return createClient(cookieStore)
}

export async function getShifts() {
	const supabase = await getSupabaseClient()

	const { data, error } = await supabase
		.from('shifts')
		.select('*')
		.order('name', { ascending: true })

	if (error) throw new Error(error.message)
	return data
}

export async function getVehicleShifts(): Promise<VehicleShiftWithShiftInfo[]> {
	const supabase = await getSupabaseClient()

	const { data, error } = await supabase
		.from('vehicle_shifts')
		.select(`
			*,
			shift_data:shifts (
				id,
				name,
				start_time,
				end_time,
				free_day
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
	})) as VehicleShiftWithShiftInfo[]
}

// SHIFTS
export async function createShift(shiftData: ShiftData) {
	const supabase = await getSupabaseClient()

	const { error } = await supabase
		.from('shifts')
		.insert([shiftData])

	if (error) throw new Error(error.message)
	revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
}

export async function updateShift(id: string, shiftData: Partial<ShiftData>) {
	const supabase = await getSupabaseClient()

	const { error } = await supabase
		.from('shifts')
		.update(shiftData)
		.eq('id', id)

	if (error) throw new Error(error.message)
	revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
}

export async function deleteShift(id: string) {
	const supabase = await getSupabaseClient()

	const { error } = await supabase
		.from('shifts')
		.delete()
		.eq('id', id)

	if (error) throw new Error(error.message)
	revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
}

// VEHICLE SHIFTS
export async function getVehicleShiftsByDateRange(
	vehicleNumber: number,
	startDate: string,
	endDate: string
) {
	try {
		const supabase = await getSupabaseClient()

		let query = supabase
			.from("vehicle_shifts")
			.select(`
				*,
				shifts (
					start_time,
					end_time,
					free_day
				)
			`)
			.or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
			.order("priority", { ascending: false })

		// Only apply vehicle number filter if not 0
		if (vehicleNumber !== 0) {
			query = query.eq("vehicle_number", vehicleNumber)
		}

		const { data: vehicleShifts, error } = await query

		if (error) {
			console.error("Database error:", error)
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

		revalidatePath(Routes.CONTROL_FLOTA.SHIFTS_PER_VEHICLE)
		return { data: transformedShifts }
	} catch (error) {
		console.error("Error in getVehicleShiftsByDateRange:", error)
		return { error: "Error fetching vehicle shifts" }
	}
} 

// VEHICLE STATUS
export async function getVehicleStatusConfigs() {
	const supabase = await getSupabaseClient()

	const { data, error } = await supabase
		.from('vehicle_status_config')
		.select('*')
		.order('label')

	if (error) {
		throw error
	}

	return data as VehicleStatusConfig[]
}

export async function getVehicleStatuses() {
	const supabase = await getSupabaseClient()

	const { data, error } = await supabase
		.from('vehicle_status')
		.select(`
			*,
			vehicle_status_config (
				label,
				color
			)
		`)
		.order('created_at', { ascending: false })

	if (error) {
		throw error
	}

	return data.map(status => ({
		id: status.id,
		vehicle_number: status.vehicle_number,
		status_id: status.status_id,
		status_label: status.vehicle_status_config.label,
		status_color: status.vehicle_status_config.color,
		start_date: status.start_date,
		end_date: status.end_date,
		comments: status.comments,
		created_at: status.created_at,
		created_by: status.created_by,
	})) as VehicleStatus[]
}

export async function createVehicleStatus(data: CreateVehicleStatusInput) {
	const supabase = await getSupabaseClient()

	const { error } = await supabase
		.from('vehicle_status')
		.insert([data])

	if (error) {
		throw error
	}
}

export async function deleteVehicleStatus(id: string) {
	const supabase = await getSupabaseClient()

	const { error } = await supabase
		.from('vehicle_status')
		.delete()
		.eq('id', id)

	if (error) {
		throw error
	}
}

export async function getVehicleStatusesForCalendar(vehicleNumber: string, startDate: string, endDate: string) {
	const supabase = await getSupabaseClient()

	const { data, error } = await supabase
		.from('vehicle_status')
		.select(`
			*,
			vehicle_status_config (
				label,
				color
			)
		`)
		.eq('vehicle_number', vehicleNumber)
		.or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
		.order('start_date')

	if (error) {
		throw error
	}

	return data.map(status => ({
		id: status.id,
		vehicle_number: status.vehicle_number,
		status_id: status.status_id,
		status_label: status.vehicle_status_config.label,
		status_color: status.vehicle_status_config.color,
		start_date: status.start_date,
		end_date: status.end_date,
		comments: status.comments,
		created_at: status.created_at,
		created_by: status.created_by,
	})) as VehicleStatus[]
}

export async function updateVehicleStatus(id: string, data: Partial<CreateVehicleStatusInput>) {
	const supabase = await getSupabaseClient()

	const { error } = await supabase
		.from('vehicle_status')
		.update(data)
		.eq('id', id)

	if (error) {
		throw error
	}
}

// VEHICLE STATUS CONFIG
export async function createVehicleStatusConfig(data: {
	label: string;
	description?: string;
	color: string;
}) {
	const supabase = await getSupabaseClient()

	const { error } = await supabase
		.from('vehicle_status_config')
		.insert([data])

	if (error) {
		throw error
	}
}

export async function updateVehicleStatusConfig(id: string, data: {
	label: string;
	description?: string;
	color: string;
}) {
	const supabase = await getSupabaseClient()

	const { error } = await supabase
		.from('vehicle_status_config')
		.update(data)
		.eq('id', id)

	if (error) {
		throw error
	}
}

export async function deleteVehicleStatusConfig(id: string) {
	const supabase = await getSupabaseClient()

	const { error } = await supabase
		.from('vehicle_status_config')
		.delete()
		.eq('id', id)

	if (error) {
		throw error
	}
} 