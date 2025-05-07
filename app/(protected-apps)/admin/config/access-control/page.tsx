import { getEmailGroupsWithCounts, getEmailGroupMembers, getSectionAccess } from '@/lib/features/access-control'
import { AccessControlForm } from '@/components/features/admin/access-control/access-control-form'

export const metadata = {
    title: 'Control de Acceso | Transvip',
    description: 'Administra los grupos de usuarios y sus permisos de acceso a las secciones del sistema.',
}

export const revalidate = 60

export default async function AccessControlPage() {
    // Fetch all groups with their counts
    const groups = await getEmailGroupsWithCounts()
    
    // Prefetch details for all groups
    const groupsWithDetails = await Promise.all(
        groups.map(async (group) => {
            const [members, access] = await Promise.all([
                getEmailGroupMembers(group.id),
                getSectionAccess(group.id)
            ])
            return {
                ...group,
                members,
                access
            }
        })
    )
    
    return (
        <AccessControlForm initialGroups={groupsWithDetails} />
    )
} 