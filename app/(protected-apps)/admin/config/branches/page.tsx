import { Suspense } from 'react'
import { BranchConfig } from '@/components/admin/branch-config/branch-config'
import SuspenseLoading from '@/components/ui/suspense'
import { getBranches } from '@/lib/services/admin'

export const metadata = {
    title: 'Configuración de Sucursales | Transvip',
    description: 'Administra las sucursales en Transvip',
}

export const revalidate = 60

async function BranchConfigContent() {
    const branches = await getBranches()
    return <BranchConfig data={branches} />
}

export default async function BranchConfigPage() {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <BranchConfigContent />
        </Suspense>
    )
}