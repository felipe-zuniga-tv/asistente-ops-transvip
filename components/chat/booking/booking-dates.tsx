import { addMinutes, differenceInDays, differenceInMinutes } from 'date-fns'
import { CheckIcon, X } from 'lucide-react'
import type { IBookingInfoOutput } from '@/types/domain/booking/types'

interface BookingDatesProps {
  result: IBookingInfoOutput
  simplified?: boolean
}

export function BookingDates({ result, simplified = false }: BookingDatesProps) {
  if (!result.dates) return null

  const booking_datetime_local = result.dates.temp_pickup_time ? new Date(result.dates.temp_pickup_time) : new Date(result.dates.job_time_utc)
  const days_to_trip = differenceInDays(booking_datetime_local, new Date())
  const minutes_to_trip = differenceInMinutes(booking_datetime_local, new Date())

  return (
    <div className='booking-detail info-customer'>
      <div className='info-section'>
        <div className='flex flex-col gap-1 w-full'>
          <div className='card-info-detail gap-1'>
            <span className='font-semibold date-tag'>Recogida:</span>
            <span>{booking_datetime_local.toLocaleString()}</span>
            {days_to_trip > 0 && (
              <>
                <span>·</span>
                <span className='font-semibold'>Faltan: {days_to_trip} días</span>
              </>
            )}
            {minutes_to_trip >= 0 && minutes_to_trip <= 180 && (
              <>
                <span>·</span>
                <span className='font-semibold'>Faltan: {minutes_to_trip} minutos</span>
              </>
            )}
            {days_to_trip < 0 && (
              <>
                <span>·</span>
                <span className='font-semibold'>Hace: {-1 * days_to_trip} día{Math.abs(days_to_trip) > 1 ? 's' : ''}</span>
              </>
            )}
            {minutes_to_trip < 0 && Math.abs(minutes_to_trip) <= 180 && (
              <>
                <span className='hidden sm:block'>·</span>
                <span className='hidden sm:block font-semibold text-red-500'>Hace: {-1 * minutes_to_trip} minutos</span>
              </>
            )}
          </div>
          {!simplified && (
            <div className='card-info-detail gap-1'>
              <span className='font-semibold date-tag'>Creación:</span>
              <span>{new Date(result.dates.creation_datetime).toLocaleString()}</span>
              {result.booking.creation_identity &&
                <>
                  <span className='hidden xs:block'>·</span>
                  <span className='hidden xs:block font-semibold'>Usuario:</span>
                  <span className='hidden xs:block'>{result.booking.creation_identity}</span>
                </>
              }
            </div>)
          }
          {result.dates.assignment_datetime && result.booking.assignment_identity &&
            <div className='card-info-detail gap-1'>
              <div className='flex flex-row gap-1 items-center w-full'>
                <span className='font-semibold date-tag'>Asignación:</span>
                <span>{new Date(result.dates.assignment_datetime).toLocaleString()}</span>
                {result.booking.assignment_identity &&
                  <>
                    <span className='hidden xs:block'>·</span>
                    <span className='hidden xs:block font-semibold'>Usuario:</span>
                    <span className='hidden xs:block'>{result.booking.assignment_identity}</span>
                  </>
                }
              </div>
            </div>
          }
          {result.dates.on_road_datetime &&
            <div className='card-info-detail gap-1'>
              <span className='font-semibold date-tag'>En Camino:</span>
              <span>{new Date(result.dates.on_road_datetime).toLocaleString()}</span>
              {result.booking.on_road_identity &&
                <>
                  <span className='hidden xs:block'>·</span>
                  <span className='hidden xs:block font-semibold'>Usuario:</span>
                  <span className='hidden xs:block'>{result.booking.on_road_identity}</span>
                </>
              }
            </div>
          }
          {result.dates.arrived_datetime &&
            <div className='card-info-detail gap-1'>
              <span className='font-semibold date-tag'>En Posición:</span>
              <span>{new Date(result.dates.arrived_datetime).toLocaleString()}</span>
              {result.booking.arrived_identity &&
                <>
                  <span className='hidden xs:block'>·</span>
                  <span className='hidden xs:block font-semibold'>Usuario:</span>
                  <span className='hidden xs:block'>{result.booking.arrived_identity}</span>
                  <span className='hidden xs:block'>·</span>
                  <BookingOnTimeArrival result={result} booking_datetime_local={booking_datetime_local} />
                </>
              }
            </div>
          }
          {result.dates.started_datetime &&
            <div className='card-info-detail gap-1'>
              <span className='font-semibold date-tag'>Inicio de Viaje:</span>
              <span>{new Date(result.dates.started_datetime).toLocaleString()}</span>
              {result.booking.started_identity &&
                <>
                  <span className='hidden xs:block'>·</span>
                  <span className='hidden xs:block font-semibold'>Usuario:</span>
                  <span className='hidden xs:block'>{result.booking.started_identity}</span>
                </>
              }
            </div>
          }
          {result.dates.completed_datetime &&
            <div className='card-info-detail gap-1'>
              <span className='font-semibold date-tag'>Fin de Viaje:</span>
              <span>{new Date(result.dates.completed_datetime).toLocaleString()}</span>
              {result.booking.ended_identity &&
                <>
                  <span className='hidden xs:block'>·</span>
                  <span className='hidden xs:block font-semibold'>Usuario:</span>
                  <span className='hidden xs:block'>{result.booking.ended_identity}</span>
                </>
              }
            </div>
          }
          {result.dates.no_show_datetime &&
            <div className='card-info-detail gap-1'>
              <span className='font-semibold date-tag'>Fecha No Show:</span>
              <span>{new Date(result.dates.no_show_datetime).toLocaleString()}</span>
              <span>·</span>
              <span className='font-semibold'>Usuario:</span>
              <span>{result.booking.no_show_identity}</span>
              <span>·</span>
              <span className='font-semibold'>Comentario:</span>
              <span>{result.booking.no_show_reason}</span>
            </div>
          }
          {result.dates.cancellation_datetime &&
            <div className='card-info-detail gap-1'>
              <span className='font-semibold date-tag'>Cancelación:</span>
              <span>{new Date(result.dates.cancellation_datetime).toLocaleString()}</span>
              <span>·</span>
              <span className='font-semibold'>Usuario:</span>
              <span>{result.booking.cancellation_identity}</span>
              { result.booking.cancellation_reason && result.booking.cancellation_reason.length > 0 && (
                <>
                  <span>·</span>
                  <span className='truncate max-w-[80px] md:max-w-[140px]'>{result.booking.cancellation_reason}</span>
                </>
              )}
            </div>
          }
        </div>
      </div>
    </div>
  )
}

interface BookingOnTimeArrivalProps {
  result: IBookingInfoOutput
  booking_datetime_local: Date
}

export function BookingOnTimeArrival({ result, booking_datetime_local }: BookingOnTimeArrivalProps) {
  const minutes_arrived_trip = differenceInMinutes(new Date(result.dates.arrived_datetime), booking_datetime_local)

  return (
    <>
      <span className='hidden xs:block'>{
        new Date(result.dates.arrived_datetime) <= addMinutes(booking_datetime_local, 10) ?
          <CheckIcon className='size-4 bg-green-500 text-white rounded-full py-0.5' /> :
          <X className='size-4 bg-red-400 text-white rounded-full py-0.5' />
      }</span>
      {Math.abs(minutes_arrived_trip) > 0 &&
        (<span className='hidden xs:block'>
          ({minutes_arrived_trip > 0 ?
            minutes_arrived_trip > 1 ?
              <>{minutes_arrived_trip} minutos después</> :
              <>{minutes_arrived_trip} minuto después</>
            :
            minutes_arrived_trip < 0 ?
              minutes_arrived_trip < -1 ?
                <>{Math.abs(minutes_arrived_trip)} minutos antes</> :
                <>{Math.abs(minutes_arrived_trip)} minuto antes</>
              : null
          })
        </span>)
      }
    </>
  )
} 