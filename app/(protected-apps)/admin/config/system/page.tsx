import { Suspense } from 'react'
import { getSystemConfigs } from '@/lib/services/system'
import { SystemConfigForm } from '@/components/features/admin/system-config/system-config-form'
import SuspenseLoading from '@/components/ui/suspense'
import type { Database } from '@/types/database/schema'
import { createClient } from "@/lib/supabase/server";
import { SystemConfigTable } from "@/components/features/admin/system-config/system-config-table";

type SystemConfig = Database['public']['Tables']['system_configs']['Row']

export const metadata = {
    title: 'Configuración del Sistema | Transvip',
    description: 'Administra la configuración general del sistema',
}

export default async function SystemConfigPage() {
    const configs = await getSystemConfigs()
    
    const llmConfig = configs?.find((config: SystemConfig) => config.key === 'llm_model_name')
    const languageConfig = configs?.find((config: SystemConfig) => config.key === 'default_language')
    const timeoutConfig = configs?.find((config: SystemConfig) => config.key === 'session_timeout')
    
    return (
        <SystemConfigForm
            initialData={{
                llm_model_name: llmConfig?.value || 'gemini-2.0-flash-lite-preview-02-05',
                default_language: languageConfig?.value || 'es',
                session_timeout: timeoutConfig ? parseInt(timeoutConfig.value) : 60,
            }}
        />
    )
}