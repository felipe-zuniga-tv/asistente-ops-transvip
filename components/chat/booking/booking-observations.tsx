import { Pencil } from 'lucide-react'
import type { IBookingInfoOutput } from '@/types/domain/booking/types'

interface BookingObservationsProps {
  result: IBookingInfoOutput
}

export function BookingObservations({ result }: BookingObservationsProps) {
  if (!result.booking.observations) return null

  return (
    <div className='card-info-detail mt-2 p-2 bg-yellow-300 rounded-md'>
      <Pencil className='size-4' />
      <span>{result.booking.observations}</span>
    </div>
  )
} 