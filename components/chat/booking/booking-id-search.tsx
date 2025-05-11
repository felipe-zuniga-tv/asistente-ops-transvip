'use client'

import { SearchIcon } from 'lucide-react'
import { BookingCard } from './booking-card'
import { SharedServiceSummary } from './shared-service-summary'
import { MESSAGE_TEMPLATES, BookingSearchRequest } from './helpers'
import { useMessageSubmission } from '@/hooks/use-message-submission'
import type { ChatSession } from '@/types/domain/chat'
import type { IBookingInfoOutput } from '@/types/domain/chat/models'

export function BookingIdSearch({ session, searchResults, content }: {
    session: ChatSession,
    searchResults: IBookingInfoOutput[],
    content?: string
}) {
    const { submitMessage } = useMessageSubmission()

    const handleClick = async (result: IBookingInfoOutput, request: BookingSearchRequest) => {
        const userMessageContent = MESSAGE_TEMPLATES[request]?.(result) ??
            `Me gustaría saber más información sobre el vehículo con patente ${result.vehicle.license_plate}.`;
        await submitMessage(userMessageContent, session);
    }

    return (
        <div className="booking-search-results flex flex-col gap-2">
            <div className='flex flex-row gap-1 items-center justify-start'>
                <SearchIcon className='h-4' />
                <span className='font-semibold'>He encontrado {searchResults.length} reserva{searchResults.length > 1 ? 's' : ''}</span>
            </div>

            <SharedServiceSummary result={searchResults} handleClick={handleClick} />

            <div className={'search-results-cards relative w-full flex flex-col gap-4 items-start'}>
                {searchResults.length > 1 && <span className='-mb-3 mt-2 font-bold'>Detalle de Reservas</span>}
                {searchResults.map((result: IBookingInfoOutput) => (
                    <BookingCard key={result.booking.id}
                        result={result}
                        handleClick={handleClick}
                    />
                ))}
            </div>
        </div>
    )
} 