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
import { Calendar, Clock, GoalIcon, HotelIcon, MailIcon, MapPin, Pencil, PhoneIcon, UserCircleIcon } from 'lucide-react';
import { WhatsappIcon } from '@/components/ui/icons';
import { buildWhatsappLink } from '@/lib/chat/functions';
import { BookingStatusBadge, CityBadge, CustomerVipBadge, PaymentRouteType, PaymentStatusBadge, ServiceNameBadge } from '../badges/chat-badges';
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
        } else if (request === 'driver') {
            userMessageContent = `Me gustaría saber más información sobre el conductor con el teléfono ${result.fleet.phone_number}.`
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
        <div className="booking-search-results flex flex-col gap-2">
            <div className='flex flex-row gap-2 items-center justify-start'>
                <HotelIcon className='h-4' />
                <span className='font-bold'>Resultados</span>
            </div>
            {/* // Ejemplo, paquete 1235058 */}
            <span>He encontrado {searchResults.length} reserva{searchResults.length > 1 ? 's' : ''}:</span>
            
            <SharedServiceSummary result={searchResults} handleClick={handleClick} />

            <div className={'search-results-cards relative w-full flex flex-col gap-4 items-start'}>
                { searchResults.length > 1 && <span className='-mb-3 mt-2 font-bold'>Detalle de Reservas</span>}
                { searchResults.map((result: BookingInfoOutputProps) => (
                    <BookingIdResultsCard key={result.booking.id} keyName={result.booking.id}
                        result={result}
                        handleClick={handleClick}
                    />
                ))}
            </div>
            {content && 
                <div className='search-results-text mt-4'>
                    <AssistantMessageContent content={content} />
                </div>
            }
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
            <BookingMainDetails result={result} />
            <BookingDates result={result} />
            <BookingPayment result={result} />
            <BookingCustomer result={result} />
            <BookingDirections result={result} />
            <BookingVehicle result={result} handleClick={handleClick} />
        </div>
    )
}

function SharedServiceSummary({ result, handleClick } : { 
    result: BookingInfoOutputProps[]
    handleClick: any
}) {

    if (result.length < 2) return null

    return (
        <div className='shared-service-summary bg-white p-2 rounded-md text-slate-900 flex flex-col gap-1.5'>
            { result.map(r => (
                <div className='shared-service-booking flex flex-row gap-2 items-center text-sm'>
                    <BookingIdBadge result={r} handleClick={handleClick} />
                    <BookingStatusBadge result={r} />
                    <PaymentStatusBadge result={r} />
                    <span>Fecha: { new Date(r.dates.job_time_utc).toLocaleString() }</span>
                    <CityBadge branch={r.branch} isCode={true} className='ml-auto' />
                </div>
            ))}
        </div>
    )
}

function BookingMainDetails({ result }: {
    result: BookingInfoOutputProps
}) {
    if (!result.booking) return null

    return (
        <div className='booking-detail main-details'>
            <div className='info-section'>
                <div className='flex flex-col gap-1 w-full'>
                    <div className='flex flex-row gap-1 items-center justify-start'>
                        {result.booking.shared_service_id && (
                            <>
                                <div className='card-info-detail gap-1'>
                                    <span className='font-semibold'>Paquete:</span>
                                    <span>{result.booking.shared_service_id}</span>
                                </div>
                                <span>·</span>
                            </>
                        )}
                        <div className='card-info-detail gap-1'>
                            <span className='font-bold'>Convenio:</span>
                            <span>{result.booking.contract_name}</span>
                            <ServiceNameBadge result={result} />
                        </div>
                    </div>
                    <div className='card-info-detail gap-1'>
                        <span>Pax: {result.booking.pax_count}</span>
                        <span>·</span>
                        <span>Sentido: {result.booking.type_of_trip}</span>
                        <span>·</span>
                        <span>RT: {result.booking.is_round_trip ? 'Sí' : 'No'}</span>
                    </div>
                    { result.booking.observations && 
                        <div className='card-info-detail mt-2 p-2 bg-yellow-300 rounded-md'>
                            <Pencil className='size-4' />
                            <span>{ result.booking.observations }</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

function BookingDates({ result }: {
    result: BookingInfoOutputProps
}) {
    if (!result.dates) return null

    const NULL_DATE = '0000-00-00 00:00:00'
    const booking_datetime_local = new Date(result.dates.job_time_utc)
    const days_to_trip = differenceInDays(booking_datetime_local, new Date())
    const minutes_to_trip = differenceInMinutes(booking_datetime_local, new Date())

    return (
        <div className='booking-detail info-customer'>
            <span className='font-bold titles-font'>Fechas</span>
            <div className='info-section'>
                <div className='flex flex-col gap-1 w-full'>
                    <div className='card-info-detail gap-1'>
                        <span className='font-semibold date-tag'>Recogida:</span>
                        <span>{booking_datetime_local.toLocaleString()}</span>
                        { days_to_trip > 0 && (
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
                                <span className='font-semibold'>Hace: {-1 * days_to_trip} día{days_to_trip > 1 ? 's' : ''}</span>
                            </>
                        )}
                        {minutes_to_trip < 0 && Math.abs(minutes_to_trip) <= 180 && (
                            <>
                                <span>·</span>
                                <span className='font-semibold text-red-500'>Hace: {-1 * minutes_to_trip} minutos</span>
                            </>
                        )}
                    </div>
                    <div className='card-info-detail gap-1'>
                        <span className='font-semibold date-tag'>Creación:</span>
                        <span>{ new Date(result.dates.creation_datetime).toLocaleString() }</span>
                    </div>
                    { result.dates.assignment_datetime !== NULL_DATE && 
                        <div className='card-info-detail gap-1'>
                            <div className='flex flex-row gap-1 items-center w-full'>
                                <span className='font-semibold date-tag'>Asignación:</span>
                                <span>{ new Date(result.dates.assignment_datetime).toLocaleString() }</span>
                                <span className='hidden xs:block'>·</span>
                                <span className='hidden xs:block font-semibold'>Usuario:</span>
                                <span className='hidden xs:block'>{ result.booking.assignment_identity }</span>
                            </div>
                        </div>
                    }
                    { result.dates.on_road_datetime !== NULL_DATE &&
                        <div className='card-info-detail gap-1'>
                            <span className='font-semibold date-tag'>En Camino:</span>
                            <span>{ new Date(result.dates.on_road_datetime).toLocaleString() }</span>
                        </div>
                    }
                    { result.dates.arrived_datetime !== NULL_DATE && 
                        <div className='card-info-detail gap-1'>
                            <span className='font-semibold date-tag'>En Posición:</span>
                            <span>{ new Date(result.dates.arrived_datetime).toLocaleString() }</span>
                        </div>
                    }
                    { result.dates.started_datetime !== NULL_DATE &&
                        <div className='card-info-detail gap-1'>
                            <span className='font-semibold date-tag'>Inicio de Viaje:</span>
                            <span>{ new Date(result.dates.started_datetime).toLocaleString() }</span>
                        </div>
                    }
                    { result.dates.completed_datetime !== NULL_DATE &&
                        <div className='card-info-detail gap-1'>
                            <span className='font-semibold date-tag'>Fin de Viaje:</span>
                            <span>{ new Date(result.dates.completed_datetime).toLocaleString() }</span>
                        </div>
                    }
                    { result.dates.no_show_datetime !== NULL_DATE &&
                        <div className='card-info-detail gap-1'>
                            <span className='font-semibold date-tag'>Fecha No Show:</span>
                            <span>{ new Date(result.dates.no_show_datetime).toLocaleString() }</span>
                            <span>·</span>
                            <span className='font-semibold'>Comentario:</span>
                            <span>{ result.booking.no_show_reason }</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

function BookingPayment({ result }: {
    result: BookingInfoOutputProps
}) {
    if (!result.payment) return null

    return (
        <div className='booking-detail info-customer'>
            <span className='font-bold titles-font'>Pago</span>
            <div className='info-section'>
                <div className='flex flex-col gap-1'>
                    <div className='card-info-detail flex-row gap-1'>
                        <span className='font-semibold'>Monto:</span>
                        <span className=''>{chileanPeso.format(result.payment.estimated_payment)}</span>
                        <PaymentRouteType result={result} />
                    </div>
                    <div className='card-info-detail flex-row gap-1'>
                        <span className='font-semibold'>Forma de Pago:</span>
                        <span className=''>{result.payment.method_name}</span>
                    </div>
                    { result.payment.fare_route_name &&
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

function BookingCustomer({ result }: {
    result: BookingInfoOutputProps
}) {
    if (!result.customer) return null

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
                { 
                    result.booking.qr_link && 
                        <div className='qr-link hidden ml-auto lg:flex flex-row items-center justify-center'>
                            <span className='font-bold text-sm'>Código QR</span>
                            <Image src={result.booking.qr_link} 
                                width={70} height={70}
                                alt={result.booking.id.toString()}
                                />
                        </div>
                }
            </div>
        </div>
    )
}

function BookingDirections({ result }: {
    result: BookingInfoOutputProps
}) {
    if (!result.directions) return null

    return (
        <div className='booking-detail info-directions'>
            <span className='font-bold titles-font'>Direcciones</span>
            <div className='info-section gap-0.5'>
                <div className='card-info-detail'>
                    <MapPin className='size-4' />
                    <div className="flex flex-row gap-2 items-center justify-start">
                        <span className='font-semibold'>Origen:</span>
                        <span className='line-clamp-1'>{result.directions.origin.address}</span>
                    </div>
                </div>
                <div className='card-info-detail'>
                    <GoalIcon className='size-4' />
                    <div className="flex flex-row gap-2 items-center justify-start">
                        <span className='font-semibold'>Destino:</span>
                        <span className='line-clamp-1'>{result.directions.destination.address}</span>
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
    const STATES_TO_SHOW = [2, 4, 12, 0, 1, 15]
    if (!STATES_TO_SHOW.includes(result.booking.status)) return null

    const WHATSAPP_TEXT = `Hola ${result.fleet.first_name ? result.fleet.first_name : ''}, te escribimos de Transvip, ¿cómo estás?`
    const whatsappLink = buildWhatsappLink(result.fleet.phone_number, WHATSAPP_TEXT)

    return (
        <div className='booking-detail info-vehicle'>
            <span className='font-bold titles-font'>Vehículo / Conductor</span>
            <div className='info-section flex flex-row items-center justify-start gap-4 w-full'>
                <div className='card-info-detail'>
                    <DriverAvatar url={result.fleet.image} alt={result.fleet.full_name} />
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='card-info-detail'>
                        <Badge variant={'default'} className='flex flex-row gap-2 bg-gray-200 hover:bg-gray-300 text-black items-center justify-start md:text-sm'>
                            <span onClick={() => handleClick(result, 'driver')} className='cursor-pointer'>{result.fleet.full_name}</span>
                        </Badge>
                    </div>
                    <div className='card-info-detail items-center gap-2'>
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