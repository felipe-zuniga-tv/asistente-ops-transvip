import type { IBookingInfoOutput } from '@/types/domain/booking/types'

export function BookingRating({ result }: { result: IBookingInfoOutput }) {
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