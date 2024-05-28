'use client'
import {
    useActions,
    useUIState
} from 'ai/rsc'
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { CarIcon, MailIcon, PhoneIcon, UserCircle, UserCircleIcon, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DriverProfileProps, DriverVehiclesProps, VehicleDetailDriversProps, VehicleDetailProps } from '@/lib/chat/types';
import { AssistantMessageContent, UserMessage } from '../message';
import { Badge } from '@/components/ui/badge';
import ToolsButton from '../tools/tools-button';
import DriverAvatar from '@/components/driver/driver-avatar';
import { Button } from '@/components/ui/button';
import { differenceInDays } from 'date-fns';
import { CityBadge, DriverStatusBadge, LicenseExpirationBadge } from '../badges/chat-badges';

export function DriverProfile({ session, driverProfile, content }: { 
    session: any,
    driverProfile: any
    content: string 
}) {
    const [_, setMessages] = useUIState()
    const { submitUserMessage } = useActions()

    const handleClick = async (vehicle : DriverVehiclesProps, request : string) => {

        let userMessageContent = ""
        if (request === 'online') {
            userMessageContent = `Me gustaría saber si el móvil ${vehicle.unique_car_id} está online.`
        } else if (request === 'details') {
            userMessageContent = `Me gustaría saber más información sobre el vehículo con patente ${vehicle.registration_number}.`
        } else {
            userMessageContent = `Me gustaría saber más información sobre el vehículo con patente ${vehicle.registration_number}.`
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
                <DriverProfileCard keyName={driverProfile.fleet_id} 
                    result={driverProfile}
                    handleVehicleClick={handleClick}
                />
            </div>
            { content && <div className='search-results-text mt-4'>
                <AssistantMessageContent content={content} />
            </div>}
        </div>
    )
}

function DriverProfileCard({ keyName, result, handleVehicleClick } : {
    keyName: any, 
    result: any,
    handleVehicleClick?: any
}) {
    return (
        <div key={keyName} className='vehicle-detail-card w-full flex flex-col gap-2 md:gap-4 bg-gray-200 p-2 rounded-xl'>
            <div className={cn(`driver-main flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4`)}>
                <DriverMainDetails result={result} />
                <DriverBadges result={result} handleStatusClick={handleVehicleClick} />
            </div>
            <DriverDocuments result={result} />
            { result.vehicles.length > 0 && <DriverVehicles result={result} handleVehicleClick={handleVehicleClick} /> }
        </div>
    )
}

function DriverMainDetails({ result } : { result : DriverProfileProps }) {
    return (
        <div className='flex flex-row gap-4 items-center justify-center md:justify-start text-slate-700 w-full'>
            <div className='driver-profile-img'>
                { result.personal.image &&
                    <DriverAvatar url={result.personal.image} alt={result.personal.full_name} />
                }
            </div>
            <div className='card-info-detail flex flex-col gap-0 items-start justify-start'>
                <span className='font-bold titles-font'>{ result.personal.full_name }</span>
                <div className='flex flex-row gap-2 items-center justify-start'>
                    <span className='font-normal text-xs'>{ result.personal.email }</span>
                    {/* <span className='font-normal text-xs'>·</span>
                    <Badge variant={"default"} className={"text-white"}>
                        <MailIcon className='size-4' />
                    </Badge> */}
                </div>
            </div>
                {/* <span>Fecha de creación: {new Date(result.created_at).toLocaleString()}</span> */}
        </div>
    )
}

function DriverDocuments({ result } : { result : DriverProfileProps }) {
    return (
        <div className='driver-documents flex flex-col gap-2 items-start justify-start text-slate-700'>
            <span className='font-bold titles-font'>Documentos</span>
            <div className='info-section flex flex-col gap-3 items-start justify-start w-full'>
                <div className='flex flex-row gap-2 items-center'>
                    <>
                        <span className='font-semibold'>Licencia</span>
                        <Badge variant={'default'} className={"bg-gray-200 text-slate-900 hover:text-white"}>
                            { result.driver_documents.license.type.toUpperCase() }
                        </Badge>
                    </>
                    <>·</>
                    <>
                        <span className='font-semibold'>Vencimiento:</span>
                        <LicenseExpirationBadge result={result} />
                    </>
                </div>
                <div className='flex flex-row gap-2 items-center text-sm'>
                    <span className='font-semibold'>RUT</span>
                    <Badge variant={'default'} className={"bg-gray-200 text-slate-900 hover:text-white"}>
                        {result.driver_documents.RUT.number}
                    </Badge>
                    {/* { result.driver_documents.RUT.image && 
                        <Image src={result.driver_documents.RUT.image} 
                            width={100} height={100}
                            className='h-12 w-auto object-contain'
                            alt={`Rut del conductor ${result.driver_documents.RUT.number}`}
                        />
                    } */}
                </div>
            </div>       {/* <span>Fecha de creación: {new Date(result.created_at).toLocaleString()}</span> */}
        </div>
    )
}

function DriverVehicles({ result, handleVehicleClick } : {
    result : DriverProfileProps 
    handleVehicleClick: any
}) {
    return (
        <div className='driver-info-vehicles flex flex-col gap-2 items-start justify-start text-slate-700'>
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
                                    onClick={() => handleVehicleClick(vehicle, 'details')}>
                                    Más detalles
                                </Button>
                                <Button variant={'outline'} className='text-xs text-white py-[1px] h-7 bg-slate-600'
                                    onClick={() => handleVehicleClick(vehicle, 'online')}>
                                    Ver si está online
                                </Button>
                            </div>

                        </div>
                    )
                }
            </div>
        </div>
    )
}

function DriverBadges({ result, handleStatusClick } : { 
    result : DriverProfileProps
    handleStatusClick: any
}) {
    return (
        <div className='gap-2 flex flex-row items-end'>
            <DriverStatusBadge result={result} />
            <CityBadge branch={result.branch} className='ml-auto' />
            {/* <ToolsButton item={result} handleClick={() => handleStatusClick({ result })} label={'Ver si está online'} /> */}
        </div>
    )
}