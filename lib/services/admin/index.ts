'use server'

import type {
    PaymentMethod,
    CreatePaymentMethodInput,
    UpdatePaymentMethodInput,
    VehicleType,
    CreateVehicleTypeInput,
    UpdateVehicleTypeInput,
    Branch,
    CreateBranchInput,
    UpdateBranchInput,
    Language,
    CreateLanguageInput,
    UpdateLanguageInput,
    Translation,
    CreateTranslationInput,
    UpdateTranslationInput,
} from '@/lib/types/admin'
import { getSupabaseClient } from "@/lib/database/actions"
import { revalidatePath } from 'next/cache'
import { Routes } from '@/utils/routes'

// Payment Methods
export async function getPaymentMethods() {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('name')
    
    if (error) throw error
    return data as PaymentMethod[]
}

export async function createPaymentMethod(input: CreatePaymentMethodInput) {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
        .from('payment_methods')
        .insert(input)
        .select()
        .single()
    
    if (error) throw error
    revalidatePath(Routes.ADMIN.PAYMENT_CONFIG)
    return data as PaymentMethod
}

export async function updatePaymentMethod(id: string, input: UpdatePaymentMethodInput) {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
        .from('payment_methods')
        .update(input)
        .eq('id', id)
        .select()
        .single()
    
    if (error) throw error
    revalidatePath(Routes.ADMIN.PAYMENT_CONFIG)
    return data as PaymentMethod
}

export async function deletePaymentMethod(id: string) {
    const supabase = await getSupabaseClient()
    const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)
    
    if (error) throw error
    revalidatePath(Routes.ADMIN.PAYMENT_CONFIG)
}

// Vehicle Types
export async function getVehicleTypes() {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .order('name')
    
    if (error) throw error
    return data as VehicleType[]
}

export async function createVehicleType(input: CreateVehicleTypeInput) {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('vehicle_types')
        .insert(input)
        .select()
        .single()
    
    if (error) throw error
    return data as VehicleType
}

export async function updateVehicleType(id: string, input: UpdateVehicleTypeInput) {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('vehicle_types')
        .update(input)
        .eq('id', id)
        .select()
        .single()
    
    if (error) throw error
    return data as VehicleType
}

export async function deleteVehicleType(id: string) {
    const supabase = await getSupabaseClient()
    const { error } = await supabase
        .from('vehicle_types')
        .delete()
        .eq('id', id)
    
    if (error) throw error
}

// Branches
export async function getBranches() {
    const supabase = await getSupabaseClient()
    
    try {
        const { data, error, status } = await supabase
            .from('branches')
            .select('*')
            .order('name')
        
        if (error) {
            console.error('Error fetching branches:', error)
            throw new Error(`Failed to fetch branches: ${error.message}`)
        }

        if (!data || status !== 200) {
            throw new Error('No branches data received')
        }
        revalidatePath(Routes.PUBLIC.SUCURSALES)
        revalidatePath(Routes.ADMIN.BRANCH_CONFIG)
        return data as Branch[]
    } catch (error) {
        console.error('Error in getBranches:', error)
        throw error
    }
}

export async function createBranch(input: CreateBranchInput) {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('branches')
        .insert(input)
        .select()
        .single()
    
    if (error) throw error
    revalidatePath(Routes.ADMIN.BRANCH_CONFIG)
    return data as Branch
}

export async function updateBranch(id: string, input: UpdateBranchInput) {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('branches')
        .update(input)
        .eq('id', id)
        .select()
        .single()
    
    if (error) throw error
    revalidatePath(Routes.ADMIN.BRANCH_CONFIG)
    return data as Branch
}

export async function deleteBranch(id: string) {
    const supabase = await getSupabaseClient()
    const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id)
    
    if (error) throw error
    revalidatePath(Routes.ADMIN.BRANCH_CONFIG)
}

// Languages
export async function getLanguages() {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('name')
    
    if (error) throw error
    return data as Language[]
}

export async function createLanguage(input: CreateLanguageInput) {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('languages')
        .insert(input)
        .select()
        .single()
    
    if (error) throw error
    return data as Language
}

export async function updateLanguage(id: string, input: UpdateLanguageInput) {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('languages')
        .update(input)
        .eq('id', id)
        .select()
        .single()
    
    if (error) throw error
    return data as Language
}

export async function deleteLanguage(id: string) {
    const supabase = await getSupabaseClient()
    const { error } = await supabase
        .from('languages')
        .delete()
        .eq('id', id)
    
    if (error) throw error
}

// Translations
export async function getTranslations(languageId: string) {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('language_id', languageId)
        .order('key')
    
    if (error) throw error
    return data as Translation[]
}

export async function createTranslation(input: CreateTranslationInput) {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('translations')
        .insert(input)
        .select()
        .single()
    
    if (error) throw error
    return data as Translation
}

export async function updateTranslation(id: string, input: UpdateTranslationInput) {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
        .from('translations')
        .update(input)
        .eq('id', id)
        .select()
        .single()
    
    if (error) throw error
    return data as Translation
}

export async function deleteTranslation(id: string) {
    const supabase = await getSupabaseClient()
    const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id)
    
    if (error) throw error
} 