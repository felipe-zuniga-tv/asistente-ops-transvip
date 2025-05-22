'use client'
import { MapPin, GoalIcon, Clock, MapIcon } from 'lucide-react'
import { Button } from '@/components/ui'
import { buildGoogleMapsURL } from '@/lib/core/utils/helpers'
import type { IBookingInfoOutput } from '@/types/domain/booking/types'

export function BookingDirections({ result }: { result: IBookingInfoOutput }) {
  if (!result.directions) return null

  const originAddress = result.directions.origin.address
  const destinationAddress = result.directions.destination.address
  const googleMapsUrl = buildGoogleMapsURL(originAddress, destinationAddress)

  return (
    <div className='booking-detail info-directions w-full'>
      <div className='info-section gap-4 md:gap-0.5 flex flex-col md:flex-row items-center'>
        <div className='w-full md:w-3/4 flex flex-col gap-1'>
          <div className='card-info-detail'>
            <MapPin className='size-4 shrink-0' />
            <div className="flex flex-row gap-1 items-center justify-start">
              <span className='font-semibold'>Origen:</span>
              <span className='line-clamp-1'>{result.directions.origin.address}</span>
            </div>
          </div>
          <div className='card-info-detail'>
            <GoalIcon className='size-4 shrink-0' />
            <div className="flex flex-row gap-1 items-center justify-start">
              <span className='font-semibold'>Destino:</span>
              <span className='line-clamp-1'>{result.directions.destination.address}</span>
            </div>
          </div>
          <div className='card-info-detail'>
            <Clock className='size-4 shrink-0' />
            <div className="flex flex-row gap-1 items-center justify-start">
              {result.directions.estimated_travel_minutes ? (
                <>
                  <span className='font-semibold'>Tiempo Estimado:</span>
                  <span>{result.directions.estimated_travel_minutes} minutos ({(result.directions.estimated_travel_minutes / 60).toFixed(2)} horas)</span>
                </>
              ) : (
                <>
                  <span className='font-semibold'>Tiempo Estimado:</span>
                  <span>N/D</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-fit md:w-1/4 flex items-center justify-end text-sm">
          <Button variant="default" className="px-6 py-0.5 bg-green-600 hover:bg-green-800"
            onClick={() => window.open(googleMapsUrl, '_blank')}>
            <MapIcon className='size-4' />
            Ver ruta
          </Button>
        </div>
      </div>
    </div>
  )
} 