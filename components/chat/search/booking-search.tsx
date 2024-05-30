'use client'
import {
    useActions,
    useUIState
} from 'ai/rsc'
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { differenceInDays, differenceInMinutes } from 'date-fns';
import { BookingInfoOutputProps } from '@/lib/chat/types';
import { AssistantMessageContent, UserMessage } from '../message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CarIcon, CircleUserIcon, Clock, GoalIcon, HotelIcon, MailIcon, MapPin, PhoneIcon, UserCircleIcon } from 'lucide-react';
import { WhatsappIcon } from '@/components/ui/icons';
import { buildWhatsappLink } from '@/lib/chat/functions';
import { BookingStatusBadge, CityBadge, CustomerVipBadge, PaymentStatusBadge } from '../badges/chat-badges';
import { BookingIdBadge } from '../badges/booking-badge';
import DriverAvatar from '@/components/driver/driver-avatar';
import Image from 'next/image';

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

    const handleClick = async (result: BookingInfoOutputProps, request: string) => {
        let userMessageContent = ""
        if (request === 'booking') {
            userMessageContent = `Me gustaría buscar la reserva ${result.booking.id}.`
        } else if (request === 'vehicle') {
            userMessageContent = `Me gustaría saber si el vehículo ${result.vehicle.vehicle_number} está online.`
        } else if (request === 'license') {
            userMessageContent = `Me gustaría saber más información sobre el vehículo con patente ${result.vehicle.license_plate}.`
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
        <div key={'booking-search-results'} className="flex flex-col gap-2">
            <div className='flex flex-row gap-2 items-center justify-start'>
                <HotelIcon className='h-4' />
                <span className='font-bold'>Resultados</span>
            </div>
            {/* // Ejemplo, paquete 1235058 */}
            <span>He encontrado {searchResults.length} reserva{searchResults.length > 1 ? 's' : ''}:</span>
            <div className={'search-results-cards relative w-full flex flex-col gap-4 items-start'}>
                {searchResults.map((result: BookingInfoOutputProps) => (
                    <BookingIdResultsCard key={result.booking.id} keyName={result.booking.id}
                        result={result}
                        handleClick={handleClick}
                    />
                ))}
            </div>
            {content && <div className='search-results-text mt-4'>
                <AssistantMessageContent content={content} />
            </div>}
        </div>
    )
}

function BookingIdResultsCard({ keyName, result, handleClick }: {
    keyName: any
    result: BookingInfoOutputProps
    handleClick: any
}) {
    return (
        <div key={keyName + " " + new Date().getMilliseconds()} className='booking-detail main-card'>
            <BookingBadges result={result} handleClick={handleClick} />
            {result.booking && <BookingMainDetails result={result} />}
            {result.customer && <BookingCustomer result={result} />}
            {result.directions && <BookingDirections result={result} />}
            {[2, 12, 0, 15].includes(result.booking.status) &&
                <BookingVehicle result={result} handleClick={handleClick} />
            }
        </div>
    )
}

function BookingMainDetails({ result }: {
    result: BookingInfoOutputProps
}) {
    const booking_datetime_local = new Date(result.booking.job_time_utc)
    const days_to_trip = differenceInDays(booking_datetime_local, new Date())
    const minutes_to_trip = differenceInMinutes(booking_datetime_local, new Date())

    return (
        <div className='booking-detail main-details'>
            <div className='info-section flex flex-col lg:flex-row gap-1 lg:gap-4 items-start lg:items-center justify-start w-full'>
                <div className='flex flex-col gap-1'>
                    {result.booking.shared_service_id && (
                        <div className='card-info-detail gap-1'>
                            <span className='font-semibold'>Paquete:</span>
                            <span>{result.booking.shared_service_id}</span>
                        </div>
                    )}
                    <div className='card-info-detail gap-1'>
                        <span className='font-bold'>Convenio:</span>
                        <span>{result.booking.contract_name}</span>
                    </div>
                    <div className='card-info-detail gap-1'>
                        <span>Pax: {result.booking.pax_count}</span>
                        <span>·</span>
                        <span>Sentido: {result.booking.type_of_trip}</span>
                        <span>·</span>
                        <span>{result.booking.service_name}</span>
                        <span>·</span>
                        <span>RT: {result.booking.is_round_trip ? 'Sí' : 'No'}</span>
                    </div>
                    <div className='card-info-detail gap-1'>
                        <Calendar className='size-4' />
                        <span>Creación: { new Date(result.booking.creation_datetime).toLocaleString() }</span>
                    </div>
                    <div className='card-info-detail gap-1'>
                        <Calendar className='size-4' />
                        <span>Fecha: {booking_datetime_local.toLocaleString()}</span>
                        {days_to_trip > 0 && (
                            <>
                                <span>·</span>
                                <span className='font-semibold'>Faltan: {days_to_trip} días</span>
                            </>
                        )}
                        {minutes_to_trip >= 0 && (
                            <>
                                <span>·</span>
                                <span className='font-semibold'>Faltan: {minutes_to_trip} minutos</span>
                            </>
                        )}
                        {days_to_trip < 0 && (
                            <>
                                <span>·</span>
                                <span className='font-semibold'>Hace: {-1 * days_to_trip} días</span>
                            </>
                        )}
                        {minutes_to_trip < 0 && Math.abs(minutes_to_trip) <= 180 && (
                            <>
                                <span>·</span>
                                <span className='font-semibold'>Hace: {-1 * minutes_to_trip} minutos</span>
                            </>
                        )}
                    </div>
                </div>
                <div className='card-info-detail payment lg:ml-auto lg:px-4 lg:flex-col gap-0 lg:gap-0'>
                    <span className='font-semibold'>Monto</span>
                    <span className='font-semibold block lg:hidden'>:</span>
                    <span className='pl-1 lg:pl-0'>{chileanPeso.format(result.payment.estimated_payment)}</span>
                </div>
            </div>
        </div>
    )
}

function BookingCustomer({ result }: {
    result: BookingInfoOutputProps
}) {
    return (
        <div className='booking-detail info-customer'>
            <span className='font-bold titles-font'>Pasajeros</span>
            <div className='info-section flex flex-col lg:flex-row gap-1 lg:gap-4 items-start lg:items-center justify-start w-full'>
                <div className='flex flex-col gap-0.5'>
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
                        <CustomerVipBadge result={result} />
                    </div>
                </div>
                <div className='qr-link hidden ml-auto lg:flex flex-row items-center justify-center'>
                    <span className='font-bold text-sm'>Código QR</span>
                    <Image src={result.booking.qr_link} alt={result.booking.id.toString()}
                        width={70} height={70}
                        />
                </div>
            </div>
        </div>
    )
}

function BookingDirections({ result }: {
    result: BookingInfoOutputProps
}) {
    return (
        <div className='booking-detail info-directions'>
            <span className='font-bold titles-font'>Direcciones</span>
            <div className='info-section gap-0.5'>
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
                        <span>{result.directions.estimated_travel_minutes} minutos ({(result.directions.estimated_travel_minutes / 60).toFixed(2)} horas)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BookingBadges({ result, handleClick }: {
    result: BookingInfoOutputProps
    handleClick: any
}) {
    return (
        <div className='booking-detail booking-badges'>
            <BookingIdBadge result={result} handleClick={handleClick} />
            <BookingStatusBadge result={result} />
            <PaymentStatusBadge result={result} />
            <CityBadge branch={result.branch} className='ml-auto' />
        </div>
    )
}

function BookingVehicle({ result, handleClick }: {
    result: BookingInfoOutputProps,
    handleClick: any
}) {
    const WHATSAPP_TEXT = `Hola ${result.fleet.first_name ? result.fleet.first_name : ''}, te escribimos de Transvip, ¿cómo estás?`
    const whatsappLink = buildWhatsappLink(result.fleet.phone_number, WHATSAPP_TEXT)

    return (
        <div className='booking-detail info-vehicle'>
            <span className='font-bold titles-font'>Vehículo / Conductor</span>
            <div className='info-section flex flex-row items-center justify-start gap-4 w-full'>
                <div className='card-info-detail'>
                    <DriverAvatar url={result.fleet.image} alt={result.fleet.full_name} />
                </div>
                <div className='flex flex-col gap-0.5'>
                    <div className='card-info-detail'>
                        {/* <CircleUserIcon className='size-4' /> */}
                        <span className='hidden'>Conductor: {result.fleet.full_name}</span>
                        <span>{result.fleet.full_name}</span>
                    </div>
                    <div className='card-info-detail items-center gap-2'>
                        {/* <CarIcon className='size-4' /> */}
                        <Badge variant={'default'} className='flex flex-row gap-2 items-center justify-start md:text-sm'>
                            <span onClick={() => handleClick(result, 'license')} className='hover:underline cursor-pointer'>PPU: {result.vehicle.license_plate}</span>
                        </Badge>
                        <Badge variant={'default'} className='flex flex-row gap-2 items-center justify-start md:text-sm'>
                            <span onClick={() => handleClick(result, 'vehicle')} className='hover:underline cursor-pointer'>Móvil: {result.vehicle.vehicle_number}</span>
                        </Badge>
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