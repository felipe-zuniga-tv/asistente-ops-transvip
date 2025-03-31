'use server'

import { createClient } from '@/utils/supabase/server'
import type {
	VehicleStatus,
	VehicleStatusConfig,
	CreateVehicleStatusInput
} from './types'

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