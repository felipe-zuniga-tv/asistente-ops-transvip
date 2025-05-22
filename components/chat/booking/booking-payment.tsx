import { PaymentRouteTypeBadge } from "@/components/features/chat/badges/chat-badges"
import { formatChileanPeso } from "@/lib/core/utils/helpers"
import type { IBookingInfoOutput } from '@/types/domain/chat/types'

interface BookingPaymentProps {
  result: IBookingInfoOutput
}

export function BookingPayment({ result }: BookingPaymentProps) {
  if (!result.payment) return null

  return (
    <div className='booking-detail info-payment'>
      <div className='info-section'>
        <div className='flex flex-col gap-1 w-full'>
          <div className='card-info-detail flex-row gap-1'>
            <span className='font-semibold'>Monto Estimado:</span>
            <span className=''>{formatChileanPeso(result.payment.estimated_payment)}</span>
            <PaymentRouteTypeBadge result={result} />
          </div>
          { result.payment.actual_payment && (
            <div className='card-info-detail flex-row gap-1'>
              <span className='font-semibold'>Monto Real:</span>
              <span className=''>{formatChileanPeso(result.payment.actual_payment)}</span>
            </div>
          )}
          <div className='card-info-detail flex-row gap-1'>
            <span className='font-semibold'>Forma de Pago:</span>
            <span className=''>{result.payment.method_name}</span>
          </div>
          {result.payment.fare_route_name &&
            <div className='card-info-detail gap-1'>
              <span className='font-semibold'>Tramo / Tarifa:</span>
              <span className=''>{result.payment.fare_route_name}</span>
            </div>
          }
        </div>
      </div>
    </div>
  )
} 