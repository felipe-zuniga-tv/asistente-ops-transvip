import { revalidatePath } from "next/cache"
import { getSupabaseClient } from "@/lib/database/actions"
import { Routes } from "@/utils/routes"

export async function getSystemConfigs() {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
        .from('system_configs')
        .select('*')
        .order('key')

    if (error) {
        console.error('Error fetching system configs:', error)
        throw error
    }
    
    revalidatePath(Routes.ADMIN.SYSTEM_CONFIG)
    return data
}

export async function updateSystemConfig({
    key,
    value,
    description
}: {
    key: string
    value: string
    description?: string | null
}) {
    const supabase = await getSupabaseClient()

    const { error } = await supabase
        .from('system_configs')
        .upsert({
            key,
            value,
            description,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'key'
        })

    if (error) {
        console.error('Error updating system config:', error)
        throw error
    }

    revalidatePath(Routes.ADMIN.SYSTEM_CONFIG)
    return true
} 