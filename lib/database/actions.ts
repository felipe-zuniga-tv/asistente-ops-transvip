'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Routes } from '@/utils/routes'

interface ShiftData {
	id?: string
	name: string
	start_time: string
	end_time: string
	free_day: number
	created_timestamp?: string
}

export async function getShifts() {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('shifts')
		.select('*')
		.order('created_timestamp', { ascending: false })

	if (error) throw new Error(error.message)
	return data
}

export async function getVehicleShifts() {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('vehicle_shifts')
		.select('*')
		.order('vehicle_number', { ascending: true })

	if (error) throw new Error(error.message)
	return data
}

export async function createShift(shiftData: ShiftData) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase
		.from('shifts')
		.insert([shiftData])

	if (error) throw new Error(error.message)
	revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
}

export async function updateShift(id: string, shiftData: Partial<ShiftData>) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase
		.from('shifts')
		.update(shiftData)
		.eq('id', id)

	if (error) throw new Error(error.message)
	revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
}

export async function deleteShift(id: string) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase
		.from('shifts')
		.delete()
		.eq('id', id)

	if (error) throw new Error(error.message)
	revalidatePath(Routes.CONTROL_FLOTA.SHIFTS)
}