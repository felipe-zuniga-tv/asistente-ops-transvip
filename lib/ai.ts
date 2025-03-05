import type { ParkingTicket } from '@/types'

interface ParsedTicketData {
  nro_boleta: string
  entry_timestamp: string
  exit_timestamp: string
  amount: number
  location: string
}

export async function parseTicketImage(imageBase64: string): Promise<ParsedTicketData> {
  const formData = new FormData()
  
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
  formData.append('files', blob)

  const response = await fetch("/api/image/parking", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Failed to parse ticket: ${response.statusText}`)
  }

  const data = await response.json()
  const parsedResult = JSON.parse(data.results[0])

  console.log(parsedResult)

  return {
    nro_boleta: parsedResult.nro_boleta,
    entry_timestamp: parsedResult.entry_date + 'T' + parsedResult.entry_time + ':00',
    exit_timestamp: parsedResult.exit_date + 'T' + parsedResult.exit_time + ':00',
    amount: parsedResult.valor,
    location: 'SCL Airport Parking'
  }
} 