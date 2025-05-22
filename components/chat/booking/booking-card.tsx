import { BookingBadges } from './booking-badges'
import { BookingMainDetails } from './booking-main-details'
import { BookingCustomer } from './booking-customer'
import { BookingDates } from './booking-dates'
import { BookingPayment } from './booking-payment'
import { BookingDirections } from './booking-directions'
import { BookingVehicle } from './booking-vehicle'
import type { IBookingInfoOutput } from '@/types/domain/chat/types'

interface BookingCardProps {
  result: IBookingInfoOutput
  handleClick?: (result: IBookingInfoOutput, request: any) => void
  simplified?: boolean
}

export function BookingCard({ result, handleClick, simplified = false }: BookingCardProps) {
  return (
    <div className='booking-detail main-card'>
      <BookingBadges result={result} handleClick={handleClick} />
      <BookingMainDetails result={result} handleClick={handleClick} />
      <BookingCustomer result={result} />
      <BookingDates result={result} simplified={simplified} />
      <BookingPayment result={result} />
      <BookingDirections result={result} />
      <BookingVehicle result={result} handleClick={handleClick} />
    </div>
  )
} 