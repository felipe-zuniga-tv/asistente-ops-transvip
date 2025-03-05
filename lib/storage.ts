import { createClient } from '@/utils/supabase/client'

const BUCKET_NAME = 'parking-tickets'

export async function uploadTicketImage(
  driverId: string,
  bookingId: string,
  imageBase64: string
): Promise<string> {
  const supabase = createClient()

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
  const { data, error } = await supabase.storage
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

export async function getTicketImageUrl(path: string): Promise<string> {
  const supabase = createClient()
  
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path)

  return publicUrl
} 