import { getBranches } from '@/lib/services/admin'
import { BranchConfig } from '@/components/admin/branch-config/branch-config'

export const metadata = {
    title: 'Configuración de Sucursales | Transvip',
    description: 'Administra las sucursales en Transvip',
}

export const revalidate = 60

export default async function BranchConfigPage() {
    const branches = await getBranches()
    return (
        <BranchConfig data={branches} />
    )
}