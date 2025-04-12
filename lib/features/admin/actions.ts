'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Routes } from '@/utils/routes'

export async function getSystemConfig(key: string) {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('system_configs')
		.select('*')
		.eq('key', key)
		.single()

	if (error) {
		console.error('Error fetching system config:', error)
		throw error
	}

	return data
}

export async function updateSystemConfig({
	key,
	value,
	description,
}: {
	key: string
	value: string
	description?: string
}) {
	const supabase = await createClient()

	const { error } = await supabase
		.from('system_configs')
		.upsert(
			{
				key,
				value,
				description,
				updated_at: new Date().toISOString(),
			},
			{
				onConflict: 'key',
			}
		)

	if (error) {
		console.error('Error updating system config:', error)
		throw error
	}

	revalidatePath(Routes.ADMIN.SYSTEM_CONFIG)
} 