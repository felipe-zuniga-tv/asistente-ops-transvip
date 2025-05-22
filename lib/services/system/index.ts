import { createClient } from "@/lib/supabase/server"

export async function getSystemConfigs(key?: string) {
    const supabase = await createClient()

    const query = supabase
        .from('system_configs')
        .select('*')

    if (key) {
        query.eq('key', key)
        return (await query.single()).data
    }

    const { data, error } = await query.order('key')

    if (error) {
        console.error('Error fetching system configs:', error)
        throw error
    }
    
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
    const supabase = await createClient()

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

    return true
} 