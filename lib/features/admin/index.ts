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
} from '@/types/domain/admin/types'
import { createClient } from '@/lib/supabase/server'

// Payment Methods
export async function getPaymentMethods() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('name')
    
    if (error) throw error
    return data as PaymentMethod[]
}

export async function createPaymentMethod(input: CreatePaymentMethodInput) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('payment_methods')
        .insert(input)
        .select()
        .single()
    
    if (error) throw error
    return data as PaymentMethod
}

export async function updatePaymentMethod(id: string, input: UpdatePaymentMethodInput) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('payment_methods')
        .update(input)
        .eq('id', id)
        .select()
        .single()
    
    if (error) throw error
    return data as PaymentMethod
}

export async function deletePaymentMethod(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)
    
    if (error) throw error
}

// Vehicle Types
export async function getVehicleTypes() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .order('name')
    
    if (error) throw error
    return data as VehicleType[]
}

export async function createVehicleType(input: CreateVehicleTypeInput) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('vehicle_types')
        .insert(input)
        .select()
        .single()
    
    if (error) throw error
    return data as VehicleType
}

export async function updateVehicleType(id: string, input: UpdateVehicleTypeInput) {
    const supabase = await createClient()
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
    const supabase = await createClient()
    const { error } = await supabase
        .from('vehicle_types')
        .delete()
        .eq('id', id)
    
    if (error) throw error
}

// Branches
export async function getBranches(salesFormActive?: boolean) {
    const supabase = await createClient()
    
    try {
        let query = supabase
            .from('branches')
            .select('*')
            .order('name')
        
        if (salesFormActive !== undefined) {
            query = query.eq('sales_form_active', salesFormActive)
        }
        
        const { data, error, status } = await query
        
        if (error) {
            console.error('Error fetching branches:', error)
            throw new Error(`Failed to fetch branches: ${error.message}`)
        }

        if (!data || status !== 200) {
            throw new Error('No branches data received')
        }
        return data as Branch[]
    } catch (error) {
        console.error('Error in getBranches:', error)
        throw error
    }
}

export async function getBranchByCode(code: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('code', code)
        .single()
    
    if (error) throw error
    return data as Branch
} 

export async function createBranch(input: CreateBranchInput) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('branches')
        .insert(input)
        .select()
        .single()
    
    if (error) throw error
    return data as Branch
}

export async function updateBranch(id: string, input: UpdateBranchInput) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('branches')
        .update(input)
        .eq('id', id)
        .select()
        .single()
    
    if (error) throw error
    return data as Branch
}

export async function deleteBranch(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id)
    
    if (error) throw error
}

// Languages
export async function getLanguages() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('name')
    
    if (error) throw error
    return data as Language[]
}

export async function createLanguage(input: CreateLanguageInput) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('languages')
        .insert(input)
        .select()
        .single()
    
    if (error) throw error
    return data as Language
}

export async function updateLanguage(id: string, input: UpdateLanguageInput) {
    const supabase = await createClient()
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
    const supabase = await createClient()
    const { error } = await supabase
        .from('languages')
        .delete()
        .eq('id', id)
    
    if (error) throw error
}

// Translations
export async function getTranslations(languageId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('language_id', languageId)
        .order('key')
    
    if (error) throw error
    return data as Translation[]
}

export async function createTranslation(input: CreateTranslationInput) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('translations')
        .insert(input)
        .select()
        .single()
    
    if (error) throw error
    return data as Translation
}

export async function updateTranslation(id: string, input: UpdateTranslationInput) {
    const supabase = await createClient()
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
    const supabase = await createClient()
    const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id)
    
    if (error) throw error
}

// Placeholder function for fetching mining divisions
export async function getMiningDivisions() {
    console.log('Fetching mining divisions...');
    // In a real scenario, this would fetch data from Supabase
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return [
        { id: '1', branchName: 'Sucursal A', agreementName: 'Convenio X', miningDivisionName: 'Division Alpha' },
        { id: '2', branchName: 'Sucursal B', agreementName: 'Convenio Y', miningDivisionName: 'Division Beta' },
    ];
}

// TODO: Add other admin related functions here if this is a new file, or ensure this is added to an existing index.ts
// For example, if you already have getBranches, getPaymentMethods, getVehicleTypes in lib/features/admin.ts or similar,
// this new function should be added there. 