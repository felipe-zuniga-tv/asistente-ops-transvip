'use server'

import type { ParkingTicket } from '@/types'
import { createClient } from '@/utils/supabase/server'

// Database table name
const TABLE_NAME = 'parking_tickets'

// TODO: Replace with actual database calls
const mockTickets: ParkingTicket[] = [
  {
    id: '1',
    booking_id: 'B001',
    driver_id: 'mock-id',
    vehicle_number: '4212',
    submission_date: new Date(),
    status: 'pending_review',
    parsed_data: {
      nro_boleta: '123456',
      entry_date: new Date().toISOString(),
      entry_time: new Date().toLocaleString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false }),
      exit_date: new Date().toISOString(),
      exit_time: new Date().toLocaleString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false }),
      amount: 5000,
      location: 'Aeropuerto de SCL',
      image_url: 'https://via.placeholder.com/150'
    }
  }
]

async function uploadImage(imageBase64: string): Promise<string> {
  // TODO: Replace with actual storage service
  // This is a mock implementation that just returns the base64 string
  return imageBase64
}

export async function getDriverTickets(driverId: string, vehicleNumber: string): Promise<ParkingTicket[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('driver_id', driverId)
    .eq('vehicle_number', vehicleNumber)
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

  console.log('imageUrl', imageUrl)
  console.log('parsedData', parsedData)
  console.log('driverId', driverId)
  console.log('bookingId', bookingId)
  
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