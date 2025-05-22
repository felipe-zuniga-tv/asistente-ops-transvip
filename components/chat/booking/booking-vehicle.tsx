import Link from 'next/link'
import { ExternalLinkIcon } from 'lucide-react'
import { Badge, Button } from '@/components/ui'
import { BookingSearchRequest } from './helpers'
import { WhatsappIcon } from '@/components/ui/whatsapp-icon'
import DriverAvatar from '@/components/features/drivers/driver-avatar'
import { buildWhatsappLink } from '@/lib/core/utils/helpers'
import type { IBookingInfoOutput } from '@/types/domain/booking/types'

interface BookingVehicleProps {
  result: IBookingInfoOutput
  handleClick: any
}

const STATES_TO_SHOW = [2, 4, 12, 0, 1, 15]

export function BookingVehicle({ result, handleClick }: BookingVehicleProps) {
  if (!STATES_TO_SHOW.includes(result.booking.status)) return null

  const WHATSAPP_TEXT = `Hola ${result.fleet.first_name ? result.fleet.first_name : ''}, te escribimos de Transvip, ¿cómo estás?`
  const whatsappLink = buildWhatsappLink(result.fleet.phone_number, WHATSAPP_TEXT)

  return (
    <div className='booking-detail info-vehicle'>
      <div className='info-section flex flex-row items-center justify-start gap-4 w-full'>
        <div className='card-info-detail'>
          <DriverAvatar url={result.fleet.image} alt={result.fleet.full_name} />
        </div>
        <div className='flex flex-col gap-2'>
          <div className='card-info-detail'>
            <Badge variant={'outline'} className='flex flex-row gap-2 bg-slate-600 hover:bg-slate-700 text-white items-center justify-start text-sm'>
              <span onClick={() => handleClick(result, BookingSearchRequest.DRIVER)} className='cursor-pointer'>{result.fleet.full_name}</span>
            </Badge>
          </div>
          <div className='card-info-detail items-center gap-2'>
            <Badge variant={"default"} className='shadow bg-gray-200 hover:bg-blue-200 text-black text-sm'>
              <span onClick={() => handleClick(result, BookingSearchRequest.LICENSE)} className='hover:underline cursor-pointer flex flex-row gap-2 items-center justify-center'>
                PPU: {result.vehicle.license_plate}
                <ExternalLinkIcon className='size-3 shrink-0' />
              </span>
            </Badge>
            <Badge variant={'default'} className='shadow bg-gray-200 hover:bg-blue-200 text-black text-sm'>
              <span onClick={() => handleClick(result, BookingSearchRequest.VEHICLE)} className='hover:underline cursor-pointer flex flex-row gap-2 items-center justify-center'>
                Móvil: {result.vehicle.vehicle_number}
                <ExternalLinkIcon className='size-3 shrink-0' />
              </span>
            </Badge>
          </div>
        </div>
        <Button variant={'outline'} className='ml-auto px-4 rounded-full bg-green-600 hover:bg-green-800 text-white hover:text-white'>
          <Link href={whatsappLink}
            target='_blank'
            className='flex flex-row items-center gap-0 sm:gap-2'>
            <span className='hidden sm:block'>Contactar</span>
            <WhatsappIcon />
          </Link>
        </Button>
      </div>
    </div>
  )
} 