import { UserCircleIcon, MailIcon, PhoneIcon } from 'lucide-react'
import { EmailLink } from '@/components/ui'
import { CustomerVipBadge } from '@/components/features/chat/badges/chat-badges'
import type { IBookingInfoOutput } from '@/types/domain/chat/types'
import Link from 'next/link'

interface BookingCustomerProps {
  result: IBookingInfoOutput
}

export function BookingCustomer({ result }: BookingCustomerProps) {
  if (!result.customer) return null

  return (
    <div className='booking-detail info-customer'>
      <div className='info-section flex flex-col lg:flex-row gap-1 lg:gap-4 items-start lg:items-center justify-start w-full'>
        <div className="flex flex-row gap-2 w-full">
          <div className='flex flex-col gap-1'>
            <div className='card-info-detail'>
              <UserCircleIcon className='size-4 shrink-0' />
              <span>{result.customer.full_name}</span>
            </div>
            <div className='card-info-detail'>
              <MailIcon className='size-4 shrink-0' />
              <EmailLink address={result.customer.email} />
            </div>
            <div className='card-info-detail'>
              <PhoneIcon className='size-4 shrink-0' />
              <Link href={`tel:${result.customer.phone_number}`} className='hover:underline'>
                <span>{result.customer.phone_number}</span>
              </Link>
            </div>
          </div>
          <div className='card-info-detail ml-auto md:ml-4'>
            <CustomerVipBadge result={result} />
          </div>
        </div>
      </div>
    </div>
  )
} 