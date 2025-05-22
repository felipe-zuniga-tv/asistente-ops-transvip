import { BookingIdBadge } from './booking-badge'
import { BookingStatusBadge, PaymentStatusBadge, CityBadge } from '@/components/features/chat/badges/chat-badges'
import type { IBookingInfoOutput } from '@/types/domain/chat/types'

interface BookingBadgesProps {
  result: IBookingInfoOutput
  handleClick: any
}

export function BookingBadges({ result, handleClick }: BookingBadgesProps) {
  return (
    <div className='hidden md:block booking-detail booking-badges'>
      <BookingIdBadge result={result} handleClick={handleClick} />
      <BookingStatusBadge result={result} />
      <PaymentStatusBadge result={result} />
      <CityBadge branch={result.branch} isCode={false} className='hidden ml-auto' />
    </div>
  )
} 