'use server'
import { revalidatePath } from 'next/cache'
import { Routes } from '@/utils/routes'
import { CreateSalesResponse, SalesResponse } from '@/lib/core/types/sales'
import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/core/auth';

const SALES_RESPONSES_TABLE = 'sales_responses'

export async function createSalesResponse(data: CreateSalesResponse): Promise<SalesResponse> {
	const supabase = await createClient()

	const { data: response, error } = await supabase
		.from(SALES_RESPONSES_TABLE)
		.insert({
			...data,
			status: 'pending',
			whatsapp_confirmed: false
		})
		.select()
		.single()

	if (error) {
		throw new Error(`Error creating sales response: ${error.message}`)
	}
	revalidatePath(Routes.SALES.RESPONSES)

	return response
}

export async function getSalesResponsesByBranch(branchCode: string) {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from(SALES_RESPONSES_TABLE)
		.select()
		.eq('branch_code', branchCode)
		.order('created_at', { ascending: false })

	if (error) {
		throw new Error(`Error fetching sales responses: ${error.message}`)
	}

	return data as SalesResponse[]
}

export async function getSalesResponse(id: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from(SALES_RESPONSES_TABLE)
		.select()
		.eq('id', id)
		.single()

	if (error) {
		throw new Error(`Error fetching sales response: ${error.message}`)
	}

	return data as SalesResponse
}

export async function getSalesResponsesStats() {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from(SALES_RESPONSES_TABLE)
		.select('branch_code, branch_name, created_at')
		.order('created_at', { ascending: false })

	if (error) {
		throw new Error(`Error fetching sales responses stats: ${error.message}`)
	}

	revalidatePath(Routes.SALES.RESPONSES)
	return data
}

export async function updateSalesResponseStatus(id: string, status: SalesResponse['status']) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from(SALES_RESPONSES_TABLE)
		.update({ status })
		.eq('id', id)
		.select()
		.single()

	if (error) {
		throw new Error(`Error updating sales response status: ${error.message}`)
	}

	revalidatePath(Routes.SALES.RESPONSES)
	return data as SalesResponse
}

export async function updateSalesResponseWhatsappConfirmation(
	id: string,
	confirmed: boolean,
) {
	const session = await getSession()
	const currentUser = session?.user as any
	const supabase = await createClient()

	const { data, error } = await supabase
		.from(SALES_RESPONSES_TABLE)
		.update({
			whatsapp_confirmed: confirmed,
			whatsapp_confirmed_at: confirmed ? new Date().toISOString() : null,
			whatsapp_confirmed_by: confirmed ? currentUser : null
		})
		.eq('id', id)
		.select()
		.single()

	if (error) {
		throw new Error(`Error updating WhatsApp confirmation: ${error.message}`)
	}

	revalidatePath(Routes.SALES.RESPONSES)
	return data as SalesResponse
}

export async function updateSalesResponseNotes(id: string, notes: string) {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from(SALES_RESPONSES_TABLE)
		.update({ notes })
		.eq('id', id)
		.select()
		.single()

	if (error) {
		throw new Error(`Error updating sales response notes: ${error.message}`)
	}

	revalidatePath(Routes.SALES.RESPONSES)
	return data as SalesResponse
}


export async function getSalesResponsesByBranchAction(branchCode: string) {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from(SALES_RESPONSES_TABLE)
		.select()
		.eq('branch_code', branchCode)
		.order('created_at', { ascending: false })

	if (error) {
		throw new Error(`Error fetching sales responses: ${error.message}`)
	}

	return data as SalesResponse[]
}

export async function updateSalesResponseStatusAction(id: string, status: SalesResponse['status']) {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from(SALES_RESPONSES_TABLE)
		.update({ status })
		.eq('id', id)
		.select()
		.single()

	if (error) {
		throw new Error(`Error updating sales response status: ${error.message}`)
	}

	revalidatePath(Routes.SALES.RESPONSES)
	return data as SalesResponse
}

export async function updateSalesResponseWhatsappConfirmationAction(
	id: string,
	confirmed: boolean,
) {
	const session = await getSession()
	const currentUser = session?.user as any

	const supabase = await createClient()

	const { data, error } = await supabase
		.from(SALES_RESPONSES_TABLE)
		.update({
			whatsapp_confirmed: confirmed,
			whatsapp_confirmed_at: confirmed ? new Date().toISOString() : null,
			whatsapp_confirmed_by: confirmed ? currentUser : null
		})
		.eq('id', id)
		.select()
		.single()

	if (error) {
		throw new Error(`Error updating WhatsApp confirmation: ${error.message}`)
	}

	revalidatePath(Routes.SALES.BRANCH_RESPONSES)
	return data as SalesResponse
}

export async function updateSalesResponseNotesAction(id: string, notes: string) {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from(SALES_RESPONSES_TABLE)
		.update({ notes })
		.eq('id', id)
		.select()
		.single()

	if (error) {
		throw new Error(`Error updating sales response notes: ${error.message}`)
	}

	revalidatePath(Routes.SALES.RESPONSES)
	return data as SalesResponse
}

export async function getSalesResponses(branchCode?: string) {
	const supabase = await createClient()

	let query = supabase
		.from(SALES_RESPONSES_TABLE)
		.select()
		.order('created_at', { ascending: false })
	
	if (branchCode) {
		query = query.eq('branch_code', branchCode)
	}

	const { data, error } = await query

	if (error) {
		throw new Error(`Error fetching sales responses: ${error.message}`)
	}

	return data as SalesResponse[]
} 