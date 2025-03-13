'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

// Update ticket status to admin_approved
export async function approveTicket(ticketId: string) {
    const supabase = await createClient()
    
    const { error } = await supabase
        .from('parking_tickets')
        .update({ 
            status: 'admin_approved'
        })
        .eq('id', ticketId)
    
    if (error) {
        throw new Error(`Failed to approve ticket: ${error.message}`)
    }
    
    // Revalidate the tickets page to reflect changes
    revalidatePath('/finanzas/tickets')
    
    return { success: true }
}

// Update ticket status to admin_rejected
export async function rejectTicket(ticketId: string) {
    const supabase = await createClient()
    
    const { error } = await supabase
        .from('parking_tickets')
        .update({ 
            status: 'admin_rejected'
        })
        .eq('id', ticketId)
    
    if (error) {
        throw new Error(`Failed to reject ticket: ${error.message}`)
    }
    
    // Revalidate the tickets page to reflect changes
    revalidatePath('/finanzas/tickets')
    
    return { success: true }
} 