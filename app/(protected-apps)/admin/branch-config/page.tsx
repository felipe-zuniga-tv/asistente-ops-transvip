import { Suspense } from 'react'
import { getBranches } from '@/lib/services/admin'
import { BranchConfig } from '@/components/admin/branch-config/branch-config'
import SuspenseLoading from '@/components/ui/suspense'

export const metadata = {
    title: 'Configuración de Sucursales | Transvip',
    description: 'Administra las sucursales en Transvip',
}

export default async function BranchConfigPage() {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <BranchConfigDashboard />
        </Suspense>
    )
}

async function BranchConfigDashboard() {
    const branches = await getBranches()
    return <BranchConfig data={branches} />
}