'use server'

import { Routes } from '@/utils/routes'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUserSectionAccess(userEmail: string): Promise<string[]> {
    const supabase = await createClient()

    // Get all sections the user has access to through their groups
    const { data: accessData, error } = await supabase
        .from('sidebar_section_access')
        .select(`
            section_id,
            email_groups!inner (
                email_group_members!inner (
                    email
                )
            )
        `)
        .eq('email_groups.email_group_members.email', userEmail)

    if (error) {
        console.error('Error fetching user section access:', error)
        return []
    }

    // Return array of section_ids
    return accessData.map(access => access.section_id)
}

export async function getEmailGroups() {
    const supabase = await createClient()

    const { data: groups, error } = await supabase
        .from('email_groups')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching email groups:', error)
        return []
    }

    return groups
}

export async function getEmailGroupMembers(groupId: string) {
    const supabase = await createClient()

    const { data: members, error } = await supabase
        .from('email_group_members')
        .select('*')
        .eq('group_id', groupId)
        .order('email')

    if (error) {
        console.error('Error fetching group members:', error)
        return []
    }

    return members
}

export async function getSectionAccess(groupId: string) {
    const supabase = await createClient()

    const { data: access, error } = await supabase
        .from('sidebar_section_access')
        .select('*')
        .eq('group_id', groupId)
        .order('section_id')

    if (error) {
        console.error('Error fetching section access:', error)
        return []
    }

    return access
}

export async function addEmailGroup(name: string, description?: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('email_groups')
        .insert([{ name, description }])
        .select()
        .single()

    if (error) {
        throw error
    }

    revalidatePath(Routes.ADMIN.ACCESS_CONTROL)

    return data
}

export async function addGroupMember(groupId: string, email: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('email_group_members')
        .insert([{ group_id: groupId, email }])
        .select()
        .single()

    if (error) {
        throw error
    }

    revalidatePath(Routes.ADMIN.ACCESS_CONTROL)

    return data
}

export async function addSectionAccess(groupId: string, sectionId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('sidebar_section_access')
        .insert([{ group_id: groupId, section_id: sectionId }])
        .select()
        .single()

    if (error) {
        throw error
    }

    revalidatePath(Routes.ADMIN.ACCESS_CONTROL)

    return data
}

export async function removeGroupMember(memberId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('email_group_members')
        .delete()
        .eq('id', memberId)

    if (error) {
        throw error
    }

    revalidatePath(Routes.ADMIN.ACCESS_CONTROL)
}

export async function removeSectionAccess(accessId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('sidebar_section_access')
        .delete()
        .eq('id', accessId)

    if (error) {
        throw error
    }

    revalidatePath(Routes.ADMIN.ACCESS_CONTROL)
}

export async function getEmailGroupsWithCounts() {
    const supabase = await createClient()

    const { data: groups, error } = await supabase
        .from('email_groups')
        .select(`
            *,
            member_count: email_group_members(count)
        `)
        .order('name')

    if (error) {
        console.error('Error fetching email groups:', error)
        return []
    }

    return groups.map(group => ({
        ...group,
        member_count: group.member_count[0].count
    }))
}

export async function updateEmailGroup(id: string, name: string, description?: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('email_groups')
        .update({ name, description })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw error
    }

    revalidatePath(Routes.ADMIN.ACCESS_CONTROL)

    return data
} 