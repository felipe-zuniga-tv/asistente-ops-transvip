'use client'
import {
    useActions,
    useUIState
} from 'ai/rsc'
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { CarIcon, PhoneIcon, UserCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssistantMessageContent, UserMessage } from '../message';
import { VehicleDetailDriversProps, VehicleDetailProps } from '@/lib/chat/types';
import { Badge } from '@/components/ui/badge';
import CityBadge from '../city-badge';
import ToolsButton from '../tools/tools-button';
// import * as Whatsapp from '../../../public/images/whatsapp-logo.svg'

export function VehicleDetail({ session, vehicleInformation, content }: { 
    session: any,
    vehicleInformation: VehicleDetailProps[]
    content: string 
}) {
    const [_, setMessages] = useUIState()
    const { submitUserMessage } = useActions()

    const handleVehicleStatusClick = async (vehicle_number : number ) => {
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
                <CarIcon className='h-4' />
                <span className='font-bold'>Datos del Móvil</span>
            </div>
            {/* // 1235058 */}
            <div className={'search-results-cards relative w-full flex flex-col gap-2 items-start'}>
                { vehicleInformation.map((result: VehicleDetailProps) => (
                    <VehicleDetailCard keyName={result.license_plate} 
                        result={result}
                        handleVehicleStatusClick={() => handleVehicleStatusClick(result.vehicle_number)}
                    />
                ))}
            </div>
            { content && <div className='search-results-text mt-4'>
                <AssistantMessageContent content={content} />
            </div>}
        </div>
    )
}

function VehicleDetailCard({ keyName, result, handleVehicleStatusClick } : {
    keyName: any, 
    result: VehicleDetailProps,
    handleVehicleStatusClick?: any
}) {
    return (
        <div key={keyName} className='vehicle-detail-card w-full flex flex-col gap-2 md:gap-4'>
            <VehicleMainDetails result={result} />
            <VehicleDrivers result={result} />
            <VehicleBadges result={result} handleStatusClick={handleVehicleStatusClick} />
        </div>
    )
}

function VehicleMainDetails({ result } : { result : VehicleDetailProps }) {
    const bgColor = result.color.code
    return (
        <div className={cn(`vehicle-main-details flex flex-col gap-2 items-start justify-start`)}>
            <span className='font-bold titles-font'>General</span>
            <div className='card-info-detail flex flex-col gap-3 items-start justify-start pl-2 w-full'>
                <div className='flex flex-row gap-4 items-center justify-start w-full'>
                    <span>PPU: { result.license_plate }</span>
                    <span>Número de Móvil: { result.vehicle_number }</span>
                </div>
                <div className='flex flex-row gap-4 items-center justify-start w-full'>
                    <span>Marca: { result.model.name }</span>
                    <span>Tipo: {result.type.name }</span>
                    { result.color.name && <Badge variant={'default'} className={cn('text-white shadow-sm', `bg-[${bgColor}] hover:bg-[${bgColor}]`)}>
                        { result.color.name.toUpperCase() }
                    </Badge>}
                </div>
                <div className='flex flex-row gap-4'>
                    <span>Contrato: { result.contract.type }</span>
                    <span>·</span>
                    <span>Sociedad: { result.contract.society_name }</span>
                </div>
                <span>Creación: {new Date(result.creation_datetime).toLocaleString()}</span>
            </div>
        </div>
    )
}

function VehicleDrivers({ result } : { result : VehicleDetailProps }) {
    return (
        <div className='vehicle-info-drivers flex flex-col gap-2 items-start justify-start'>
            <span className='font-bold titles-font'>Conductores</span>
            <ul className='pl-2_'>
                {
                    result.drivers.map((driver: VehicleDetailDriversProps) => 
                        <li className='flex flex-row gap-2'>
                            <div className='card-info-detail'>
                                <UserCircleIcon className='size-4' />
                                <span>{driver.first_name.trim() + " " + driver.last_name.trim()}</span>
                            </div>
                            <span>·</span>
                            <div className='card-info-detail'>
                                <PhoneIcon className='size-4' />
                                <Link href={`tel:${driver.country_code.trim() + driver.phone.trim()}`} className='hover:underline'>
                                    <span>{driver.country_code.trim() + driver.phone.trim()}</span>
                                </Link>
                            </div>
                        </li>
                    )
                }
            </ul>
        </div>
    )
}

function VehicleBadges({ result, handleStatusClick } : { 
    result : VehicleDetailProps,
    handleStatusClick: any
}) {
    const vehicleStatus = result.status === 1 ? 'Activo' : 'Inactivo'
    
    return (
        <div className='gap-2 flex flex-row items-end'>
            <Badge variant={"default"} 
                className={cn("py-2 text-white", 
                result.status === 1 ? 'bg-green-700 hover:bg-green-700' :
                result.status === 0 ? 'bg-red-400 hover:bg-red-400' :
                'bg-gray-800')}>
                { vehicleStatus }
            </Badge>
            <CityBadge code={result.branch.code} />
            <ToolsButton item={result} handleClick={() => handleStatusClick({ result })} label={'Ver si está online'} />
            {/* <Button variant={'outline'} 
                className='text-slate-900'
                onClick={handleStatusClick}
                >
                Ver si está online
            </Button> */}
        </div>
    )
}