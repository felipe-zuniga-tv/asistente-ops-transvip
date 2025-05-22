import { BookingIdBadge } from './booking-badge'
import { BookingStatusBadge, PaymentStatusBadge, CityBadge } from '@/components/features/chat/badges/chat-badges'
import GoogleMapsButton from './google-maps-url-button'
import { formatChileanPeso } from '@/lib/core/utils/helpers'
import type { IBookingInfoOutput } from '@/types/domain/booking/types'

interface SharedServiceSummaryProps {
  result: IBookingInfoOutput[]
  handleClick?: any
}

export function SharedServiceSummary({ result, handleClick }: SharedServiceSummaryProps) {
  if (result.length < 2) return null

  return (
    <div className='shared-service-summary bg-white p-2 rounded-md text-slate-900 flex flex-col gap-1.5'>
      <SharedServiceTotals result={result} />
      {result.map(r => (
        <div key={r.booking.id.toString()} className='shared-service-booking flex flex-row gap-2 items-center text-sm'>
          <BookingIdBadge result={r} handleClick={handleClick} />
          <BookingStatusBadge result={r} />
          <PaymentStatusBadge result={r} />
          <span>Fecha: {r.dates.temp_pickup_time ? new Date(r.dates.temp_pickup_time).toLocaleString() : new Date(r.dates.job_time_utc).toLocaleString()}</span>
          <CityBadge branch={r.branch} isCode={false} className='ml-auto' />
        </div>
      ))}
      <GoogleMapsButton result={result} className='mx-auto' text='Ver en Google Maps' />
    </div>
  )
}

interface SharedServiceTotalsProps {
  result: IBookingInfoOutput[]
}

export function SharedServiceTotals({ result }: SharedServiceTotalsProps) {
  const totalPayment = result.reduce((acc, curr) => acc + (curr.payment.actual_payment || 0), 0)

  return (
    <div className='shared-service-totals card-info-detail flex flex-row gap-3 justify-start bg-green-200 rounded-md shadow-md mb-2'>
      <div className='shared-service-total-payment flex flex-row gap-1 p-2 w-full'>
        <span className='font-semibold'>Pago Total:</span>
        <span>{formatChileanPeso(totalPayment)}</span>
      </div>
    </div>
  )
} 