'use server'

import { createClient } from "@/lib/supabase/server"
import { VehicleStatus, VehicleStatusConfig, CreateVehicleStatusInput } from "@/types/domain/vehicle/types"

// VEHICLE STATUS
export async function getVehicleStatusConfigs() {
	const supabase = await createClient()

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
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('vehicle_status')
		.select(`
			*,
			vehicle_status_config (
				label,
				color
			)
		`)
		.eq('is_active', true)
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
		updated_by: status.updated_by,
		is_active: status.is_active,
	})) as VehicleStatus[]
}

export async function createVehicleStatus(data: CreateVehicleStatusInput) {
	const supabase = await createClient()

	const { error } = await supabase
		.from('vehicle_status')
		.insert([data])

	if (error) {
		throw error
	}
}

export async function deleteVehicleStatus(id: string, updated_by?: string | null) {
	const supabase = await createClient()
	
	// Update is_active to false instead of deleting
	const { error } = await supabase
		.from('vehicle_status')
		.update({ 
			is_active: false,
			updated_by: updated_by || null
		})
		.eq('id', id)

	if (error) {
		throw error
	}
}

export async function getVehicleStatusesForCalendar(vehicleNumber: string, startDate: string, endDate: string) {
	const supabase = await createClient()

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
		.eq('is_active', true)
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
		updated_by: status.updated_by,
		is_active: status.is_active,
	})) as VehicleStatus[]
}

export async function updateVehicleStatus(id: string, data: Partial<CreateVehicleStatusInput>) {
	const supabase = await createClient()

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
	const supabase = await createClient()

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
	const supabase = await createClient()

	const { error } = await supabase
		.from('vehicle_status_config')
		.update(data)
		.eq('id', id)

	if (error) {
		throw error
	}
}

export async function deleteVehicleStatusConfig(id: string) {
	const supabase = await createClient()

	const { error } = await supabase
		.from('vehicle_status_config')
		.delete()
		.eq('id', id)

	if (error) {
		throw error
	}
} 