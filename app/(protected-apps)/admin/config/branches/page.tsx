import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { BranchConfig } from '@/components/admin/branch-config/branch-config'
import SuspenseLoading from '@/components/ui/suspense'
import { getBranches } from '@/lib/services/admin'
import { getSession } from '@/lib/core/auth'
import { Routes } from '@/utils/routes'
import { ConfigCardContainer } from '@/components/tables/config-card-container'

export const metadata = {
    title: 'Configuración de Sucursales | Transvip',
    description: 'Administra las sucursales en Transvip',
}

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