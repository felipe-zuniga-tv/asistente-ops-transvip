'use client'
import {
    useActions,
    useUIState
} from 'ai/rsc'
import { nanoid } from 'nanoid';
import { UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DriverProfileProps, DriverVehiclesProps } from '@/lib/chat/types';
import { AssistantMessageContent, UserMessage } from '../message';
import { Badge } from '@/components/ui/badge';
import DriverAvatar from '@/components/driver/driver-avatar';
import { Button } from '@/components/ui/button';
import { CityBadge, DriverStatusBadge, LicenseExpirationBadge } from '../badges/chat-badges';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import Link from 'next/link';

export function DriverProfile({ session, driverProfile, content }: { 
    session: any,
    driverProfile: any
    content: string 
}) {
    const [_, setMessages] = useUIState()
    const { submitUserMessage } = useActions()

    const handleDriverClick = async (result : DriverProfileProps) => {
        let userMessageContent = `Me gustaría construir un resumen de las evaluaciones del conductor ${result.personal.email}.`

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

    const handleVehicleClick = async (result : DriverVehiclesProps, request : string) => {

        let userMessageContent = ""
        if (request === 'online') {
            userMessageContent = `Me gustaría saber si el móvil ${result.unique_car_id} está online.`
        } else if (request === 'details') {
            userMessageContent = `Me gustaría saber más información sobre el vehículo con patente ${result.registration_number}.`
        } else {
            userMessageContent = `Me gustaría saber más información sobre el vehículo con patente ${result.registration_number}.`
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
                <UserCircle className='h-4' />
                <span className='font-bold'>Datos del Conductor</span>
            </div>
            <div className={'search-results-cards relative w-full flex flex-col gap-2 items-start'}>
                <DriverProfileCard key={driverProfile.fleet_id} 
                    result={driverProfile}
                    handleDriverClick={handleDriverClick}
                    handleVehicleClick={handleVehicleClick}
                />
            </div>
            { content && <div className='search-results-text mt-4'>
                <AssistantMessageContent content={content} />
            </div>}
        </div>
    )
}

function DriverProfileCard({ result, handleDriverClick, handleVehicleClick } : {
    result: any,
    handleDriverClick?: any
    handleVehicleClick?: any
}) {
    return (
        <div className='driver-detail-card w-full'>
            <div className='flex flex-col gap-2 md:gap-3 bg-gray-200 p-2 rounded-lg'>
                <div className='driver-main'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4'>
                        <DriverMainDetails result={result} />
                        <DriverRatings result={result} handleClick={handleDriverClick} />
                        <DriverBadges result={result} handleStatusClick={handleVehicleClick} />
                    </div>
                </div>
                <DriverDocuments result={result} />
                <DriverVehicles result={result} handleClick={handleVehicleClick} />
            </div>
        </div>
    )
}

function DriverMainDetails({ result } : { 
    result : DriverProfileProps 
}) {
    return (
        <div className='driver-main-details'>
            <div className='flex flex-row gap-4 items-center justify-center md:justify-start text-slate-700 w-full'>
                <div className='driver-profile-img'>
                    <DriverAvatar url={result.personal.image} alt={result.personal.full_name} />
                </div>
                <div className='card-info-detail flex flex-col gap-0 items-start justify-start'>
                    <div className='flex flex-row gap-2 items-center justify-start'>
                        <span className='font-bold titles-font'>{ result.personal.full_name }</span>
                    </div>
                    <div className='flex flex-row gap-2 items-center justify-start'>
                        <span className='font-normal text-xs'>{ result.personal.email }</span>
                        <span>·</span>
                        <span className='font-normal text-xs'>{ result.personal.phone }</span>
                    </div>
                    <div className='flex flex-row gap-2 items-center justify-start'>
                        <span className='text-xs font-bold'>Nota:</span>
                        <span className='text-xs -ml-1'>{ result.quality.avg_rating.toFixed(2) }</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DriverRatings({ result, handleClick } : { 
    result : DriverProfileProps
    handleClick: any
 }) {
    return (
        <Button variant={'outline'} className='py-1 text-xs bg-slate-700 text-white'
            onClick={() => handleClick(result)}>
                Ver evaluaciones
        </Button>
    )
}

function DriverDocuments({ result } : { result : DriverProfileProps }) {
    console.log(result);
    
    return (
        <div className='driver-documents'>
            <div className='flex flex-col gap-2 items-start justify-start text-slate-700'>
                <span className='font-bold titles-font'>Documentos</span>
                <div className='info-section flex flex-col gap-2 items-start justify-start w-full'>
                    <div className='card-info-detail driver-document-rut gap-4 w-full h-10'>
                        <div className='flex flex-row gap-2 items-center'>
                            <span className='font-semibold'>RUT</span>
                            <Badge variant={'default'} className={"bg-gray-200 text-slate-900 hover:text-white"}>
                                {result.driver_documents.RUT.number}
                            </Badge>
                            { result.invoice_rut && result.invoice_rut !== 'NULL' &&
                                <>
                                    <span>·</span>
                                    <div className='flex flex-row gap-2 items-center'>
                                        <span className='font-semibold'>RUT Facturación</span>
                                        <Badge variant={'default'} className={"bg-gray-200 text-slate-900 hover:text-white"}>
                                            {result.invoice_rut}
                                        </Badge>
                                    </div>
                                </>
                            }
                        </div>
                        <div className='ml-auto'>
                            <Zoom>
                                <Image src={result.driver_documents.RUT.image} 
                                    width={1200} height={900} 
                                    className='h-10 w-auto'
                                    alt={result.personal.full_name} 
                                />
                            </Zoom>
                        </div>
                    </div>
                    <div className='card-info-detail driver-document-license gap-4 w-full h-10'>
                        <div className='flex flex-row gap-2 items-center'>
                            <span className='font-semibold'>Licencia</span>
                            <Badge variant={'default'} className={"bg-gray-200 text-slate-900 hover:text-white"}>
                                { result.driver_documents.license.type.toUpperCase() }
                            </Badge>
                        </div>
                        <div className='flex flex-row gap-2 items-center'>
                            <span className='font-semibold'>Vencimiento:</span>
                            <LicenseExpirationBadge result={result} />
                        </div>
                        <div className='ml-auto'>
                            <Zoom>
                                <Image src={result.driver_documents.license.image} 
                                    width={1200} height={900} 
                                    className='h-10 w-auto'
                                    alt={result.personal.full_name} 
                                    />
                            </Zoom>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DriverVehicles({ result, handleClick } : {
    result : DriverProfileProps 
    handleClick: any
}) {
    if (result.vehicles.length === 0) return null

    return (
        <div className='driver-vehicles'>
            <div className='flex flex-col gap-2 items-start justify-start text-slate-700'>
                <span className='font-bold titles-font'>Vehículos Propios</span>
                <div className='info-section flex flex-col gap-2 items-center justify-start w-full text-sm'>
                    {
                        result.vehicles.map((vehicle: DriverVehiclesProps) => 
                            <div key={vehicle.registration_number} className='flex flex-row gap-3 justify-start items-center w-full'>
                                <span>Móvil: { vehicle.unique_car_id }</span>
                                <span>PPU: { vehicle.registration_number }</span>
                                <Badge variant={'default'} 
                                    className={vehicle.working_status === 1 ? 'bg-green-700 hover:bg-green-700' :
                                    'bg-red-400 hover:bg-red-400' }>
                                    { vehicle.working_status === 1 ? 'Activo': 'Inactivo' }
                                </Badge>
                                <div className='vehicle-actions flex-row flex gap-x-1 ml-auto'>
                                    <Button variant={'outline'} className='text-xs text-white py-[1px] h-7 bg-slate-600'
                                        onClick={() => handleClick(vehicle, 'details')}>
                                        Más detalles
                                    </Button>
                                    <Button variant={'outline'} className='text-xs text-white py-[1px] h-7 bg-slate-600'
                                        onClick={() => handleClick(vehicle, 'online')}>
                                        Ver si está online
                                    </Button>
                                </div>

                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

function DriverBadges({ result, handleStatusClick } : { 
    result : DriverProfileProps
    handleStatusClick?: any
}) {
    return (
        <div className='gap-2 flex flex-row items-end'>
            <DriverStatusBadge result={result} />
            <CityBadge branch={result.branch} className='ml-auto' />
            {/* <ToolsButton item={result} handleClick={() => handleStatusClick({ result })} label={'Ver si está online'} /> */}
        </div>
    )
}