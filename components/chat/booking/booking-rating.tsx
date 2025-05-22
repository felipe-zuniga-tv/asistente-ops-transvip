import type { IBookingInfoOutput } from '@/types/domain/chat/types'

interface BookingRatingProps {
  result: IBookingInfoOutput
}

export function BookingRating({ result }: BookingRatingProps) {
  if (!result.rating || result.rating.number === 0) return null

  return (
    <div className='card-info-detail gap-1'>
      <span className='font-semibold'>Calificación:</span>
      <span>{result.rating.number.toFixed(1)}</span>
      <span>·</span>
      <span className='font-semibold'>Comentario:</span>
      <span>{result.rating.comment}</span>
    </div>
  )
} 