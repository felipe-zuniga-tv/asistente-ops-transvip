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
import ToolsButton from '../tools/tools-button';
import { Button } from '@/components/ui/button';
import { CityBadge, VehicleStatusBadge } from '../badges/chat-badges';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import Image from 'next/image'

export function VehicleDetail({ session, vehicleInformation, content }: { 
    session: any,
    vehicleInformation: VehicleDetailProps[]
    content: string 
}) {
    const [_, setMessages] = useUIState()
    const { submitUserMessage } = useActions()

    const handleDriverClick = async(driver : VehicleDetailDriversProps) => {
        const userMessageContent = `Búscame el perfil del conductor de teléfono ${driver.country_code.replace('+', '').trim()}${driver.phone.trim()}.`
    
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

    const handleVehicleStatusClick = async (vehicle_number : number) => {
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
                    <VehicleDetailCard key={result.license_plate} 
                        result={result}
                        handleDriverClick={handleDriverClick}
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

function VehicleDetailCard({ result, handleDriverClick, handleVehicleStatusClick } : {
    result: VehicleDetailProps,
    handleDriverClick?: any
    handleVehicleStatusClick?: any
}) {
    return (
        <div className='vehicle-detail-information w-full p-3 px-2 bg-gray-200 rounded-md text-slate-900'>
            <div className={"flex flex-col gap-2 md:gap-3"}>
                <VehicleBadges result={result} handleStatusClick={handleVehicleStatusClick} />
                <VehicleMainDetails result={result} />
                <VehicleDocuments result={result} />
                <VehicleDrivers result={result} handleClick={handleDriverClick}/>
            </div>
        </div>
    )
}

function VehicleMainDetails({ result } : { result : VehicleDetailProps }) {
    const bgColor = result.color.code
    return (
        <div className='vehicle-main-details'>
            <div className='flex flex-col gap-2 items-start justify-start'>
                <span className='hidden font-bold titles-font'>General</span>
                <div className='info-section'>
                    <div className='card-info-detail flex flex-col gap-2 items-start justify-start w-full'>
                        <div className='flex flex-row gap-1 items-center justify-start w-full'>
                            <span className='font-semibold'>PPU:</span>
                            <span>{ result.license_plate }</span>
                            <span>·</span>
                            <span className='font-semibold'>Número de Móvil:</span>
                            <span>{ result.vehicle_number }</span>
                            <span>·</span>
                            <Button variant={'outline'} className='h-6 bg-slate-600 text-white text-xs'>
                                <Link href="https://apps.mtt.cl/consultaweb/" target='_blank'>
                                    Buscar en MTT
                                </Link>
                            </Button>
                        </div>
                        <div className='flex flex-row gap-2 items-center justify-start w-full'>
                            <span>Marca: { result.model.name }</span>
                            <span>·</span>
                            <span>Tipo: { result.type.name }</span>
                            { result.color.name && <Badge variant={'default'} className={cn('text-white shadow-sm bg-gray-200', `bg-[${bgColor}] hover:bg-[${bgColor}]`)}>
                                { result.color.name.toUpperCase() }
                            </Badge>}
                        </div>
                        <div className='flex flex-row gap-2 items-center justify-start w-ful'>
                            <span>Contrato: { result.contract.type }</span>
                            <span>·</span>
                            <span>Sociedad: { result.contract.society_name }</span>
                        </div>
                        <span>Creación: {new Date(result.creation_datetime).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function VehicleDocuments({ result } : { result : VehicleDetailProps }) {
    return (
        <div className='vehicle-documents'>
            <div className='flex flex-col gap-2 items-start justify-start'>
                <span className='font-bold titles-font'>Documentos</span>
                <div className='info-section'>
                    { result.documents.permission_of_circulation && 
                        <div className='card-info-detail'>
                            <span>Permiso de Circulación</span>
                            <Zoom>
                                <Image src={result.documents.permission_of_circulation} 
                                    width={1200} height={900} 
                                    className='h-10 w-auto'
                                    alt={result.license_plate} 
                                />
                            </Zoom>
                        </div>
                    }                        
                </div>
            </div>
        </div>
    )
}

function VehicleDrivers({ result, handleClick } : { 
    result : VehicleDetailProps 
    handleClick: any
}) {
    return (
        <div className='vehicle-info-drivers flex flex-col gap-1 items-start justify-start'>
            <span className='font-bold titles-font'>Conductores: { result.drivers.length } </span>
            <ul className='info-section w-full flex flex-col gap-1 max-h-[250px] overflow-auto'>
                {
                    result.drivers.map((driver: VehicleDetailDriversProps) => 
                        <li className='flex flex-row gap-2 w-full'>
                            <div className='card-info-detail text-sm'>
                                <UserCircleIcon className='size-4' />
                                <span>{driver.first_name.trim() + " " + driver.last_name.trim()}</span>
                            </div>
                            <span className='hidden'>·</span>
                            <div className='card-info-detail text-sm hidden'>
                                <PhoneIcon className='size-4' />
                                <Link href={`tel:${driver.country_code.trim() + driver.phone.trim()}`} className='hover:underline'>
                                    <span>{driver.country_code.trim() + driver.phone.trim()}</span>
                                </Link>
                            </div>
                            <div className='ml-auto'>
                                <Button variant={'outline'}
                                    className='text-xs text-white py-[1px] h-7 bg-slate-600'
                                    onClick={() => handleClick(driver)}
                                >
                                    Buscar perfil
                                </Button>
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
    return (
        <div className='gap-2 flex flex-row items-end'>
            <VehicleStatusBadge result={result} />
            <ToolsButton item={result} handleClick={() => handleStatusClick({ result })} label={'Ver si el móvil está online'} />
            <CityBadge branch={result.branch} className='ml-auto' />
        </div>
    )
}