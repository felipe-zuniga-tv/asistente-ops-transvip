'use client'
import {
    useActions,
    useUIState
} from 'ai/rsc'
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { CarIcon, PhoneIcon, UserCircle, UserCircleIcon, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DriverProfileProps, DriverVehiclesProps, VehicleDetailDriversProps, VehicleDetailProps } from '@/lib/chat/types';
import { AssistantMessageContent, UserMessage } from '../message';
import { Badge } from '@/components/ui/badge';
import CityBadge from '../city-badge';
import ToolsButton from '../tools/tools-button';
import Image from 'next/image';
// import * as Whatsapp from '../../../public/images/whatsapp-logo.svg'

export function DriverProfile({ session, driverProfile, content }: { 
    session: any,
    driverProfile: any
    content: string 
}) {
    const [_, setMessages] = useUIState()
    const { submitUserMessage } = useActions()

    const handleClick = async (vehicle_number : number ) => {
        const userMessageContent = `Me gustaría saber si el móvil ${vehicle_number} está online.`

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
                    // handleVehicleStatusClick={() => handleClick(driverProfile.vehicle_number)}
                />
            </div>
            { content && <div className='search-results-text mt-4'>
                <AssistantMessageContent content={content} />
            </div>}
        </div>
    )
}

function DriverProfileCard({ keyName, result, handleVehicleStatusClick } : {
    keyName: any, 
    result: any,
    handleVehicleStatusClick?: any
}) {
    return (
        <div key={keyName} className='vehicle-detail-card w-full flex flex-col gap-2 md:gap-4'>
            <DriverMainDetails result={result} />
            <DriverVehicles result={result} />
            <DriverBadges result={result} handleStatusClick={handleVehicleStatusClick} />
        </div>
    )
}

function DriverMainDetails({ result } : { result : DriverProfileProps }) {
    return (
        <div className={cn(`result-fleet-header flex flex-row items-center justify-between gap-4`)}>
            <div className='flex flex-row gap-4 items-center justify-start'>
                <div className='driver-profile-img'>
                    { result.personal.image !== '' ? 
                        <Image src={result.personal.image}
                            width={100} height={100}
                            className='h-12 w-12 md:h-16 md:w-16 shadow-md object-cover rounded-full' 
                            alt={result.personal.full_name}
                            />
                        : <UserIcon className='size-12 rounded-full shadow-md bg-gray-100 text-black p-2' />
                    }
                </div>
                <div className='card-info-detail flex flex-col gap-0 items-start justify-start'>
                    <span className='font-bold titles-font'>{ result.personal.full_name }</span>
                    {/* <div className='flex flex-row gap-4'>
                        <span>Contrato: { result.contract.type }</span>
                        <span>·</span>
                        <span>Sociedad: { result.contract.society_name }</span>
                    </div> */}
                    <span>Fecha de creación: {new Date(result.created_at).toLocaleString()}</span>
                </div>
            </div>
        </div>
    )
}

function DriverVehicles({ result } : { result : DriverProfileProps }) {
    return (
        <div className='driver-info-vehicles flex flex-col gap-2 items-start justify-start'>
            <span className='font-bold titles-font'>Vehículos</span>
            <div className='flex flex-col gap-1 items-center justify-start'>
                {
                    result.vehicles.map((vehicle: DriverVehiclesProps) => 
                        <div className='flex flex-row gap-3'>
                            <div className='card-info-detail'>
                                <CarIcon className='size-4' />
                                <span>Móvil: { vehicle.unique_car_id }</span>
                                <Badge variant={'default'} 
                                    className={vehicle.working_status === 1 ? 'bg-green-700 hover:bg-green-700' :
                                    'bg-red-400 hover:bg-red-400' }>
                                    { vehicle.working_status === 1 ? 'Activo': 'Inactivo' }
                                </Badge>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

function DriverBadges({ result, handleStatusClick } : { 
    result : DriverProfileProps,
    handleStatusClick: any
}) {
    const driverStatus = result.status.current === 1 ? 'Online' : 'Offline'
    
    return (
        <div className='gap-2 flex flex-row items-end'>
            <Badge variant={"default"} 
                className={cn("py-2 text-white", 
                result.status.current === 1 ? 'bg-green-700 hover:bg-green-700' :
                result.status.current === 0 ? 'bg-red-400 hover:bg-red-400' :
                'bg-gray-800')}>
                { driverStatus }
            </Badge>
            <CityBadge code={result.branch.code} />
            {/* <ToolsButton item={result} handleClick={() => handleStatusClick({ result })} label={'Ver si está online'} /> */}
        </div>
    )
}