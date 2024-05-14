'use client'
import {
    // useAIState,
    useActions,
    useUIState
} from 'ai/rsc'
import { BookingInfoOutputProps } from '@/lib/chat/functions';
import { nanoid } from 'nanoid';
import { AssistantMessageContent, UserMessage } from '../message';
import Link from 'next/link';
import { Calendar, CarIcon, CircleUserIcon, Clock, GoalIcon, HotelIcon, MailIcon, MapPin, PhoneIcon, UserCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import CityBadge from '../city-badge';
import { differenceInDays } from 'date-fns';
import { bookingStatus } from '@/lib/transvip/config';
// import * as Whatsapp from '../../../public/images/whatsapp-logo.svg'

let chileanPeso = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
});

export function BookingIdSearch({ searchResults, content }: { searchResults: BookingInfoOutputProps[], content: string }) {
    // const [aiState] = useAIState()
    const [_, setMessages] = useUIState()
    const { submitUserMessage } = useActions()

    const handleClick = async ({ result } : { result : BookingInfoOutputProps }) => {
        const userMessageContent = `Me gustaría saber más sobre la reserva ${result.booking.id}.`

        setMessages((currentMessages: any) => [
            ...currentMessages,
            {
                id: nanoid(),
                display: <UserMessage content={userMessageContent} />
            }
        ])

        const response = await submitUserMessage(userMessageContent)
        setMessages((currentMessages: any) => [
            ...currentMessages,
            response
        ])
    }
    
    const handleVehicleNumberClick = async (vehicle_number : number ) => {
        const userMessageContent = `Me gustaría saber si el móvil ${vehicle_number} está online.`

        setMessages((currentMessages: any) => [
            ...currentMessages,
            {
                id: nanoid(),
                display: <UserMessage content={userMessageContent} />
            }
        ])

        const response = await submitUserMessage(userMessageContent)
        setMessages((currentMessages: any) => [
            ...currentMessages,
            response
        ])
    }

    return (
        <div key={'results'} className="flex flex-col gap-2">
            <div className='flex flex-row gap-2 items-center justify-start'>
                <HotelIcon className='h-4' />
                <span className='font-bold'>Resultados</span>
            </div>
            {/* // 1235058 */}
            <span>He encontrado {searchResults.length} reserva{searchResults.length > 1 ? 's' : ''}:</span>
            <div className={'search-results-cards relative w-full flex flex-col gap-2 items-start'}>
                { searchResults.map((result: BookingInfoOutputProps) => (
                    <BookingIdResultsCard keyName={result.booking.id} 
                        result={result}
                        handleClick={handleClick}
                        handleVehicleNumberClick={() => handleVehicleNumberClick(result.vehicle.vehicle_number)}
                    />
                ))}
            </div>
            { content && <div className='search-results-text mt-4'>
                <AssistantMessageContent content={content} />
            </div>}
        </div>
    )
}

function BookingIdResultsCard({ keyName, result, handleClick, handleVehicleNumberClick } : {
    keyName: any, 
    result: BookingInfoOutputProps,
    handleClick: any,
    handleVehicleNumberClick: any
}) {
    return (
        <div key={keyName + " " + new Date().getMilliseconds()} className='search-results-card booking-information w-full'>
            <div className={"flex flex-col gap-2 md:gap-4"}
                // onClick={() => handleClick({ result })}
                >
                { result.booking && (
                    <div className='flex flex-row items-start justify-between'>
                        <BookingMainDetails result={result} />
                        <Badge variant={"default"} 
                            className={cn("py-2 text-white w-fit bg-transvip/80 hover:bg-transvip-dark text-sm", "")}>
                            { result.booking.id }
                        </Badge>
                    </div>
                )}
                { result.customer && <BookingCustomer result={result} />}
                { result.directions && <BookingDirections result={result} />}
                { [2, 12, 0].includes(result.booking.status) && 
                    <BookingVehicle result={result} handleVehicleNumberClick={handleVehicleNumberClick} /> 
                }

                <BookingBadges result={result} />
            </div>
        </div>
    )
}

function BookingMainDetails({ result } : { result : BookingInfoOutputProps}) {
    const daysToTrip = differenceInDays(new Date(result.booking.job_time), new Date())


    return (
        <div className='booking-main-details flex flex-col gap-2 items-start justify-start'>
            <span className='font-bold titles-font'>General</span>
            <div className='flex flex-row sm:flex-col gap-4 sm:gap-0 items-start justify-start pl-2'>
                { result.booking.shared_service_id && (
                    <div className='booking-card-info-detail gap-2'>
                        <span>Paquete: {result.booking.shared_service_id}</span>
                    </div>
                )}
                <div className='booking-card-info-detail'>
                    <Calendar className='size-4' />
                    <span>{new Date(result.booking.job_time).toLocaleString()}</span>
                    { daysToTrip > 0 && (
                        <>
                            <span>·</span>
                            <span className='font-semibold'>Faltan: {daysToTrip} días</span>
                        </>
                    )}
                    { daysToTrip < 0 && (
                        <>
                            <span>·</span>
                            <span className='font-semibold'>Hace: {-1*daysToTrip} días</span>
                        </>
                    )}
                </div>
                <div className='booking-card-info-detail gap-2'>
                    <span>Pax: {result.booking.pax_count}</span>
                    <span>·</span>
                    <span>Sentido: {result.booking.type_of_trip}</span>
                    <span>·</span>
                    <span>{result.booking.service_name}</span>
                    <span>·</span>
                    <span>{result.booking.contract_name}</span>
                    <span>·</span>
                    <span>RT: {result.booking.is_round_trip === 1 ? 'Sí': 'No'}</span>
                </div>
                <div className='payment booking-card-info-detail'>
                    <span className='font-semibold'>Monto:</span>
                    <span>{chileanPeso.format(result.payment.estimated_payment)}</span>
                </div>
            </div>
        </div>
    )
}

function BookingCustomer({ result } : { result : BookingInfoOutputProps}) {
    return (
        <div className='booking-info-customer flex flex-col gap-2 items-start justify-start'>
            <span className='font-bold titles-font'>Pasajeros</span>
            <div className='flex flex-row sm:flex-col gap-4 sm:gap-0 items-start justify-start pl-2'>
                <div className='booking-card-info-detail'>
                    <UserCircleIcon className='size-4' />
                    <span>{result.customer.full_name}</span>
                </div>
                <div className='booking-card-info-detail'>
                    <PhoneIcon className='size-4' />
                    <Link href={`tel:${result.customer.phone_number}`} className='hover:underline'>
                        <span>{result.customer.phone_number}</span>
                    </Link>
                </div>
                <div className='booking-card-info-detail'>
                    <MailIcon className='size-4' />
                    <Link href={`mailto:${result.customer.email}`} className='hover:underline'>
                        <span>{result.customer.email}</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

function BookingDirections({ result } : { result : BookingInfoOutputProps}) {
    return (
        <div className='booking-info-directions flex flex-col gap-1 justify-start'>
            <span className='font-bold titles-font'>Direcciones</span>
            <div className='flex flex-row sm:flex-col gap-4 sm:gap-0 items-start justify-start pl-2'>
                <div className='booking-card-info-detail'>
                    <MapPin className='size-4' />
                    <div className="flex flex-row gap-2 items-center justify-start">
                        <span className='font-semibold'>Origen:</span>
                        <span className='line-clamp-1'>{result.directions.origin}</span>
                    </div>
                </div>
                <div className='booking-card-info-detail'>
                    <GoalIcon className='size-4' />
                    <div className="flex flex-row gap-2 items-center justify-start">
                        <span className='font-semibold'>Destino:</span>
                        <span className='line-clamp-1'>{result.directions.destination}</span>
                    </div>
                </div>
                <div className='booking-card-info-detail'>
                    <Clock className='size-4' />
                    <div className="flex flex-row gap-2 items-center justify-start">
                        <span className='font-semibold'>Tiempo Estimado:</span>
                        <span>{result.directions.eta} minutos ({(result.directions.eta / 60).toFixed(2)} horas)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BookingBadges({ result } : { result : BookingInfoOutputProps}) {
    const paymentStatus = result.payment.status === 0 ? 'No pagada': 'Pagada'
    const bookingStatusLabel = bookingStatus.filter(bs => bs.status === result.booking.status).length ? 
    bookingStatus.filter(bs => bs.status === result.booking.status)[0].label : 'Otro estado'
    
    return (
        <div className='gap-2 flex flex-row items-end'>
            <Badge variant={"default"} 
                className={cn("py-2 text-white", 
                result.booking.status === 6 ? 'bg-red-600' :
                result.booking.status === 9 ? 'bg-orange-800' :
                result.booking.status === 2 ? 'bg-green-700' :
                result.booking.status === 12 ? 'bg-yellow-500' :
                'bg-black')}>
                { bookingStatusLabel }
            </Badge>
            <Badge variant={"default"} 
                className={cn("py-2 text-white", 
                result.payment.status === 0 ? 'bg-red-600' : 'bg-green-700')}>
                {paymentStatus}
            </Badge>
            <CityBadge code={result.branch.code} />
        </div>
    )
}

function BookingVehicle({ result, handleVehicleNumberClick } : {
    result : BookingInfoOutputProps, 
    handleVehicleNumberClick : any 
}) {
    return (
        <div className='booking-info-vehicle flex flex-col gap-1 justify-start'>
            <span className='font-bold titles-font'>Vehículo / Conductor</span>
            <div className='booking-card-info-detail pl-2'>
                <CarIcon className='size-4' />
                <div className='flex flex-row gap-2 items-center justify-start'>
                    <span onClick={handleVehicleNumberClick} className='hover:underline'>Móvil: {result.vehicle.vehicle_number}</span>
                    <span>PPU: {result.vehicle.license_plate}</span>
                </div>
            </div>
            <div className='booking-card-info-detail pl-2'>
                <CircleUserIcon className='size-4' />
                <span>Conductor: {result.fleet.full_name}</span>
            </div>
        </div>
    )
}