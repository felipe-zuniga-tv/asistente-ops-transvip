'use client'
import {
    useActions,
    useUIState
} from 'ai/rsc'
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { differenceInDays, differenceInMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { BookingInfoOutputProps } from '@/lib/chat/types';
import { AssistantMessageContent, UserMessage } from '../message';
import { Calendar, CarIcon, CircleUserIcon, Clock, GoalIcon, HotelIcon, MailIcon, MapPin, PhoneIcon, UserCircleIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CityBadge from '../city-badge';
import { bookingStatus, paymentStatus } from '@/lib/transvip/config';
import { Button } from '@/components/ui/button';
import { WhatsappIcon } from '@/components/ui/icons';

let chileanPeso = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
});

export function BookingIdSearch({ session, searchResults, content }: { 
    session: any,
    searchResults: BookingInfoOutputProps[], 
    content: string 
}) {
    const [_, setMessages] = useUIState()
    const { submitUserMessage } = useActions()

    const handleClick = async (result : BookingInfoOutputProps, request: string) => {
        let userMessageContent = ""
        if (request === 'booking') {
            userMessageContent = `Me gustaría buscar la reserva ${result.booking.id}.`
        } else if (request === 'vehicle') {
            userMessageContent = `Me gustaría saber si el vehículo ${result.vehicle.vehicle_number} está online.`
        } else {
            userMessageContent = `Me gustaría saber más información sobre el vehículo con patente ${result.vehicle.license_plate}.`
        }

        setMessages((currentMessages: any) => [
            ...currentMessages,
            {
                id: nanoid(),
                display: <UserMessage content={userMessageContent} session={session} />
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
            {/* // Ejemplo, paquete 1235058 */}
            <span>He encontrado {searchResults.length} reserva{searchResults.length > 1 ? 's' : ''}:</span>
            <div className={'search-results-cards relative w-full flex flex-col gap-4 items-start'}>
                { searchResults.map((result: BookingInfoOutputProps) => (
                    <BookingIdResultsCard keyName={result.booking.id} 
                        result={result}
                        handleClick={handleClick}
                    />
                ))}
            </div>
            { content && <div className='search-results-text mt-4'>
                <AssistantMessageContent content={content} />
            </div>}
        </div>
    )
}

function BookingIdResultsCard({ keyName, result, handleClick } : {
    keyName: any, 
    result: BookingInfoOutputProps,
    handleClick: any
}) {
    return (
        <div key={keyName + " " + new Date().getMilliseconds()} className='booking-information w-full p-3 px-2 bg-gray-200 rounded-md text-slate-900'>
            <div className={"flex flex-col gap-2 md:gap-4"}
                >
                { result.booking && (<BookingMainDetails result={result} handleClick={handleClick} />)}
                { result.customer && <BookingCustomer result={result} />}
                { result.directions && <BookingDirections result={result} />}
                { [2, 12, 0, 9].includes(result.booking.status) && 
                    <BookingVehicle result={result} handleClick={handleClick} /> 
                }

                <BookingBadges result={result} />
            </div>
        </div>
    )
}

function BookingMainDetails({ result, handleClick } : { 
    result : BookingInfoOutputProps
    handleClick: any
}) {
    const booking_datetime_local = new Date(result.booking.job_time_utc)
    const days_to_trip = differenceInDays(booking_datetime_local, new Date())
    const minutes_to_trip = differenceInMinutes(booking_datetime_local, new Date())

    return (
        <div className='booking-main-details'>
            <div className='flex flex-col gap-2 items-start justify-start w-full'>
                <div className='booking-id-section flex flex-row items-end justify-start'>
                    <Button variant={"default"}
                        onClick={() => handleClick(result, 'booking')}
                        className={cn("py-2 text-white w-fit bg-transvip/80 hover:bg-transvip-dark text-sm z-20_", "")}>
                        { result.booking.id }
                    </Button>
                </div>
                <div className='info-section flex flex-col lg:flex-row gap-0 lg:gap-4 items-start lg:items-center justify-start w-full'>
                    <div className='flex flex-col'>
                        { result.booking.shared_service_id && (
                            <div className='card-info-detail gap-2'>
                                <span>Paquete: {result.booking.shared_service_id}</span>
                            </div>
                        )}
                        <div className='card-info-detail gap-2'>
                            <Calendar className='size-4' />
                            <span>{ booking_datetime_local.toLocaleString() }</span>
                            { days_to_trip > 0 && (
                                <>
                                    <span>·</span>
                                    <span className='font-semibold'>Faltan: {days_to_trip} días</span>
                                </>
                            )}
                            { minutes_to_trip >= 0 && (
                                <>
                                    <span>·</span>
                                    <span className='font-semibold'>Faltan: {minutes_to_trip} minutos</span>
                                </>
                            )}
                            { days_to_trip < 0 && (
                                <>
                                    <span>·</span>
                                    <span className='font-semibold'>Hace: {-1*days_to_trip} días</span>
                                </>
                            )}
                            { minutes_to_trip < 0 && Math.abs(minutes_to_trip) <= 180 && (
                                <>
                                    <span>·</span>
                                    <span className='font-semibold'>Hace: {-1*minutes_to_trip} minutos</span>
                                </>
                            )}
                        </div>
                        <div className='card-info-detail gap-2'>
                            <span>Pax: {result.booking.pax_count}</span>
                            <span>·</span>
                            <span>Sentido: {result.booking.type_of_trip}</span>
                            <span>·</span>
                            <span>{result.booking.service_name}</span>
                            <span>·</span>
                            <span>RT: {result.booking.is_round_trip === 1 ? 'Sí': 'No'}</span>
                        </div>
                        <div className='card-info-detail gap-2'>
                            <span className='font-bold'>Convenio:</span>
                            <span>{result.booking.contract_name}</span>
                        </div>
                    </div>
                    <div className='card-info-detail payment lg:ml-auto lg:px-4 lg:flex-col gap-2 lg:gap-0'>
                        <span className='font-semibold'>Monto</span>
                        <span>{chileanPeso.format(result.payment.estimated_payment)}</span>
                    </div>
                </div>
            </div>
    </div>
    )
}

function BookingCustomer({ result } : { result : BookingInfoOutputProps}) {
    return (
        <div className='booking-info-customer'>
            <div className='flex flex-col gap-1 items-start justify-start'>
                <span className='font-bold titles-font'>Pasajeros</span>
                <div className='info-section'>
                    <div className='card-info-detail'>
                        <UserCircleIcon className='size-4' />
                        <span>{result.customer.full_name}</span>
                    </div>
                    <div className='card-info-detail'>
                        <PhoneIcon className='size-4' />
                        <Link href={`tel:${result.customer.phone_number}`} className='hover:underline'>
                            <span>{result.customer.phone_number}</span>
                        </Link>
                    </div>
                    <div className='card-info-detail'>
                        <MailIcon className='size-4' />
                        <Link href={`mailto:${result.customer.email}`} className='hover:underline'>
                            <span>{result.customer.email}</span>
                        </Link>
                        <Badge variant={'outline'} className={result.customer.vip_flag ? 'bg-orange-200' : 'bg-gray-200'}>
                            { result.customer.vip_flag ? 'VIP' : 'NO VIP' }
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BookingDirections({ result } : { result : BookingInfoOutputProps}) {
    return (
        <div className='booking-info-directions'>
            <div className='flex flex-col gap-1 items-start justify-start'>
                <span className='font-bold titles-font'>Direcciones</span>
                <div className='info-section'>
                    <div className='card-info-detail'>
                        <MapPin className='size-4' />
                        <div className="flex flex-row gap-2 items-center justify-start">
                            <span className='font-semibold'>Origen:</span>
                            <span className='line-clamp-1'>{result.directions.origin}</span>
                        </div>
                    </div>
                    <div className='card-info-detail'>
                        <GoalIcon className='size-4' />
                        <div className="flex flex-row gap-2 items-center justify-start">
                            <span className='font-semibold'>Destino:</span>
                            <span className='line-clamp-1'>{result.directions.destination}</span>
                        </div>
                    </div>
                    <div className='card-info-detail'>
                        <Clock className='size-4' />
                        <div className="flex flex-row gap-2 items-center justify-start">
                            <span className='font-semibold'>Tiempo Estimado:</span>
                            <span>{result.directions.estimated_travel_time} minutos ({(result.directions.estimated_travel_time / 60).toFixed(2)} horas)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BookingBadges({ result } : { result : BookingInfoOutputProps}) {
    const paymentStatusLabel = paymentStatus.filter(ps => ps.status === result.payment.status)[0].label
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
                {paymentStatusLabel}
            </Badge>
            <CityBadge code={result.branch?.code} className='ml-auto' />
        </div>
    )
}

function BookingVehicle({ result, handleClick } : {
    result : BookingInfoOutputProps, 
    handleClick : any 
}) {
    const WHATSAPP_TEXT = `Hola ${result.fleet.first_name ? result.fleet.first_name : ''}, te escribimos de Transvip, ¿cómo estás?`
    const whatsappLink = encodeURI(`https://wa.me/${result.fleet.phone_number.replace('+', '')}?text=${WHATSAPP_TEXT}`)

    return (
        <div className='booking-info-vehicle flex flex-col gap-1 justify-start'>
            <span className='font-bold titles-font'>Vehículo / Conductor</span>
            <div className='info-section flex flex-row items-center justify-start gap-4 w-full'>
                <div>
                    <div className='card-info-detail'>
                        <CarIcon className='size-4' />
                        <div className='flex flex-row gap-2 items-center justify-start'>
                            <span>PPU: {result.vehicle.license_plate}</span>
                            <span onClick={() => handleClick(result, 'vehicle')} className='hover:underline cursor-pointer'>Móvil: {result.vehicle.vehicle_number}</span>
                        </div>
                    </div>
                    <div className='card-info-detail'>
                        <CircleUserIcon className='size-4' />
                        <span>Conductor: {result.fleet.full_name}</span>
                    </div>
                </div>
                <Button variant={'outline'} className='ml-auto px-2.5 rounded-full bg-green-600 hover:bg-green-800 text-white hover:text-white'>
                    <Link href={whatsappLink} 
                        target='_blank'
                        className='flex flex-row items-center gap-0 lg:gap-2'>
                        <span className='hidden xl:block'>Contactar</span>
                        <WhatsappIcon />
                    </Link>
                </Button>
            </div>
        </div>
    )
}