import { Suspense } from 'react'
import { getSystemConfigs } from '@/lib/services/admin'
import { SystemConfigForm } from '@/components/admin/system-config/system-config-form'
import SuspenseLoading from '@/components/ui/suspense'

export const metadata = {
    title: 'Configuración del Sistema | Transvip',
    description: 'Administra la configuración general del sistema',
}

export default async function SystemConfigPage() {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <SystemConfigDashboard />
        </Suspense>
    )
}

async function SystemConfigDashboard() {
    const configs = await getSystemConfigs()
    
    const llmConfig = configs?.find(config => config.key === 'llm_model_name')
    const languageConfig = configs?.find(config => config.key === 'default_language')
    const timeoutConfig = configs?.find(config => config.key === 'session_timeout')
    const maintenanceConfig = configs?.find(config => config.key === 'maintenance_mode')
    
    return (
        <SystemConfigForm
            initialData={{
                llm_model_name: llmConfig?.value || 'gemini-2.0-flash-lite-preview-02-05',
                default_language: languageConfig?.value || 'es',
                session_timeout: timeoutConfig ? parseInt(timeoutConfig.value) : 60,
                maintenance_mode: maintenanceConfig ? maintenanceConfig.value === 'true' : false,
            }}
        />
    )
} 