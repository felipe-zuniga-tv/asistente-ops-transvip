'use server'

import type { ParkingTicket } from '@/types/domain/tickets'
import { Routes } from '@/utils/routes'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Database table name
const TABLE_NAME = 'parking_tickets'

export async function getDriverTickets(driverId: string): Promise<ParkingTicket[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('driver_id', driverId)
    .order('submission_date', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch tickets: ${error.message}`)
  }

  return data || []
}

export async function getRecentDriverTickets(driverId: string, limit: number = 5): Promise<ParkingTicket[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('driver_id', driverId)
    .order('submission_date', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch tickets: ${error.message}`)
  }

  return data || []
}

export async function getTicketById(ticketId: string): Promise<ParkingTicket | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', ticketId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Record not found
    throw new Error(`Failed to fetch ticket: ${error.message}`)
  }

  return data
}

export async function createTicket(
  driverId: string,
  vehicleNumber: string,
  bookingId: string,
  imageUrl: string,
  parsedData: ParkingTicket['parsed_data']
): Promise<ParkingTicket> {
  // No need to upload image as we now receive the URL directly
  const supabase = await createClient()
  
  const ticket: Omit<ParkingTicket, 'id'> = {
    booking_id: bookingId,
    driver_id: driverId,
    vehicle_number: vehicleNumber,
    submission_date: new Date(),
    status: 'pending_review',
    parsed_data: {
      ...parsedData,
      image_url: imageUrl
    }
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([ticket])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create ticket: ${error.message}`)
  }

  return data
}

interface BookingValidation {
  isValid: boolean
  error?: string
}

export async function validateBookingId(bookingId: string): Promise<BookingValidation> {
  // TODO: Replace with actual booking validation
  return {
    isValid: true
  }
}

export async function validateTicketTiming(
  exitTimestamp: string,
  bookingId: string
): Promise<BookingValidation> {
  // TODO: Replace with actual timing validation
  // Should check if ticket exit time is within 2 hours of booking start
  return {
    isValid: true
  }
}

export async function getAllParkingTickets(): Promise<ParkingTicket[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('submission_date', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch tickets: ${error.message}`)
  }

  return data || []
}

// Admin Functionality - Check tickets from the admin side
// Update ticket status to admin_approved
export async function approveTicket(ticketId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
      .from(TABLE_NAME)
      .update({ 
          status: 'admin_approved'
      })
      .eq('id', ticketId)
  
  if (error) {
      throw new Error(`Failed to approve ticket: ${error.message}`)
  }
  
  // Revalidate the tickets page to reflect changes
  revalidatePath(Routes.FINANCE.TICKETS)
  
  return { success: true }
}

// Update ticket status to admin_rejected
export async function rejectTicket(ticketId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
      .from(TABLE_NAME)
      .update({ 
          status: 'admin_rejected'
      })
      .eq('id', ticketId)
  
  if (error) {
      throw new Error(`Failed to reject ticket: ${error.message}`)
  }
  
  // Revalidate the tickets page to reflect changes
  revalidatePath(Routes.FINANCE.TICKETS)
  
  return { success: true }
} 