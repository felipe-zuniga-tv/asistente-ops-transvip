import { Suspense } from 'react'
import { getBranches } from '@/lib/services/admin'
import { BranchConfig } from '@/components/admin/branch-config/branch-config'
import SuspenseLoading from '@/components/ui/suspense'

export const metadata = {
    title: 'Configuración de Sucursales | Transvip',
    description: 'Administra las sucursales en Transvip',
}

export const revalidate = 0;

export default async function BranchConfigPage() {
    const branches = await getBranches()

    return (
        <Suspense fallback={<SuspenseLoading />}>
            <BranchConfig data={branches} />
        </Suspense>
    )
}