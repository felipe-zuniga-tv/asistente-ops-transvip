'use server'
import { createClient } from '@/lib/supabase/server'

const BUCKET_NAME = 'parking-tickets'

// Client-side upload (affected by RLS)
export async function uploadTicketImage(
  driverId: string,
  bookingId: string,
  imageBase64: string
): Promise<string> {
  const supabase = await createClient()

  // Convert base64 to blob
  const base64Data = imageBase64.split(',')[1]
  const byteCharacters = atob(base64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024)
    const byteNumbers = new Array(slice.length)

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    byteArrays.push(new Uint8Array(byteNumbers))
  }

  const blob = new Blob(byteArrays, { type: 'image/jpeg' })

  // Generate a unique filename
  const timestamp = new Date().toISOString()
  const filename = `${driverId}/${bookingId}_${timestamp}.jpg`

  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, blob, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filename)

  return publicUrl
}

// Server-side upload (to bypass RLS)
export async function uploadTicketImageServer(
  driverId: string,
  bookingId: string,
  imageBase64: string
): Promise<string> {
  'use server'

  const supabase = await createClient()

  // Convert base64 to blob
  const base64Data = imageBase64.split(',')[1]
  const byteArrays = []

  // In Node.js environment (server-side), use Buffer instead of atob
  const byteCharacters = Buffer.from(base64Data, 'base64').toString('binary')

  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024)
    const byteNumbers = new Array(slice.length)

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    byteArrays.push(Buffer.from(byteNumbers))
  }

  // Generate a unique filename
  const timestamp = new Date().toISOString()
  const filename = `${driverId}/${bookingId}_${timestamp}.jpg`

  // Create file from buffer
  const buffer = Buffer.concat(byteArrays.map(arr => Buffer.from(arr)))

  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, buffer, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filename)

  return publicUrl
}

export async function getTicketImageUrl(path: string): Promise<string> {
  const supabase = await createClient()

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path)

  return publicUrl
} 