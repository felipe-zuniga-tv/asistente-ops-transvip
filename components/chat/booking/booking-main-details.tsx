'use client'
import { Badge } from '@/components/ui'
import { ServiceNameBadge, CityBadge } from '@/components/features/chat/badges/chat-badges'
import type { IBookingInfoOutput } from '@/types/domain/booking/types'

interface BookingMainDetailsProps {
  result: IBookingInfoOutput
  handleClick: any
}

export function BookingMainDetails({ result, handleClick }: BookingMainDetailsProps) {
  if (!result.booking) return null

  return (
    <div className='booking-detail main-details'>
      <div className='info-section'>
        <div className='flex flex-row gap-2 w-full'>
          <div className='flex flex-col gap-1 w-full'>
            <div className='flex flex-row gap-1 items-center justify-start'>
              {result.booking.shared_service_id && (
                <>
                  <div className='card-info-detail gap-1'>
                    <span className='font-semibold'>Paquete:</span>
                    <Badge
                      variant="outline"
                      className='cursor-pointer bg-gray-400/50 hover:bg-secondary/80'
                      onClick={() => handleClick(result, 'shared_service')}
                    >
                      {result.booking.shared_service_id}
                    </Badge>
                  </div>
                  <span>·</span>
                </>
              )}
              <div className='card-info-detail gap-1'>
                <span className='font-semibold'>Convenio:</span>
                <span>{result.booking.contract_name}</span>
                <ServiceNameBadge result={result} />
              </div>
            </div>
            <div className='card-info-detail gap-1'>
              <span className='font-semibold'>Pax:</span>
              <span>{result.booking.pax_count}</span>
              <span>·</span>
              <span className='font-semibold'>Sentido:</span>
              <span>{result.booking.type_of_trip}</span>
              <span>·</span>
              <span className='font-semibold'>RT:</span>
              <span>{result.booking.is_round_trip ? 'Sí' : 'No'}</span>
            </div>
            {/* BookingRating and BookingObservations will be imported as subcomponents in their own files */}
          </div>
          <div className='card-info-detail'>
            <CityBadge branch={result.branch} isCode={false} />
          </div>
        </div>
      </div>
    </div>
  )
} 