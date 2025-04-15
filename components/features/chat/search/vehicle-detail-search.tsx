'use client'
import Link from 'next/link';
import { CarIcon, PhoneIcon, UserCircleIcon } from 'lucide-react';
import { cn } from '@/utils/ui';
import { AssistantMessageContent } from '../message';
import { IVehicleDetailDrivers, IVehicleDetail } from '@/types/domain/chat/models';
import { Badge, Button } from '@/components/ui';
import ToolsButton from '../tools/tools-button';
import { CityBadge, VehicleStatusBadge } from '../badges/chat-badges';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import Image from 'next/image'
import { useMessageSubmission } from '@/hooks/use-message-submission';
import { ChatSession } from '@/types/domain/chat';

const vehicleColor = [
    { name: 'BLANCO', code: '#ffffff', color: 'bg-white hover:bg-gray-100 text-black' },
    { name: 'GRIS', code: '#aeaaaa', color: 'bg-gray-100 hover:bg-gray-200 text-black' },
    { name: 'amarillo', code: '#ffff00', color: 'bg-yellow-200 hover:bg-yellow-300 text-black' },
    { name: 'azul', code: '#0070c0', color: 'bg-[#0070c0] hover:bg-[#0070c0] text-white' },
    { name: 'beige', code: '#ffe699', color: 'bg-[#ffe699] text-black' },
    { name: 'burdeo', code: '#a50021', color: 'bg-[#a50021] text-black' },
    { name: 'café', code: '#bf8f00', color: 'bg-[#bf8f00] text-black' },
    { name: 'celeste', code: '#00b0f0', color: 'bg-[#00b0f0] text-black' },
    { name: 'dorado', code: '#ffcc00', color: 'bg-[#ffcc00] text-black' },
    { name: 'fucsia', code: '#ff66cc', color: 'bg-[#ff66cc] text-black' },
    { name: 'morado', code: '#cc3399', color: 'bg-[#cc3399] text-black' },
    { name: 'naranja', code: '#ed7d31', color: 'bg-[#ed7d31] text-black' },
    { name: 'negro', code: '#000000', color: 'bg-[#000000] text-white' },
    { name: 'plata', code: '#d9d9d9', color: 'bg-[#d9d9d9] text-black' },
    { name: 'rojo', code: '#ff0000', color: 'bg-[#ff0000] text-white' },
    { name: 'rosa', code: '#ff99ff', color: 'bg-[#ff99ff] text-black' },
    { name: 'verde', code: '#00b050', color: 'bg-[#00b050] text-black' },
]

export function VehicleDetail({ session, vehicleInformation, content }: { 
    session: ChatSession,
    vehicleInformation: IVehicleDetail[]
    content: string 
}) {
    const { submitMessage } = useMessageSubmission()

    const handleDriverClick = (driver: IVehicleDetailDrivers) => 
        submitMessage(`Búscame el perfil del conductor de teléfono ${driver.country_code.replace('+', '').trim()}${driver.phone.trim()}`, session)

    const handleVehicleStatusClick = (vehicle_number: number) => 
        submitMessage(`Me gustaría saber si el móvil ${vehicle_number} está online.`, session)

    const handleLicensePlateClick = (license_plate: string) => 
        submitMessage(`Búscame el móvil con la PPU ${license_plate} en MTT.`, session)
    
    return (
        <div key={'results'} className="flex flex-col gap-2">
            <div className='flex flex-row gap-2 items-center justify-start'>
                <CarIcon className='h-4' />
                <span className='font-bold'>Datos del Móvil</span>
            </div>
            {/* // 1235058 */}
            <div className={'search-results-cards relative w-full flex flex-col gap-2 items-start'}>
                { vehicleInformation.map((result: IVehicleDetail) => (
                    <VehicleDetailCard key={result.license_plate} 
                        result={result}
                        handleDriverClick={handleDriverClick}
                        handleVehicleStatusClick={() => handleVehicleStatusClick(result.vehicle_number)}
                        handleLicensePlateClick={() => handleLicensePlateClick(result.license_plate)}
                    />
                ))}
            </div>
            { content && <div className='search-results-text mt-4'>
                <AssistantMessageContent content={content} />
            </div>}
        </div>
    )
}

function VehicleDetailCard({ result, handleDriverClick, handleVehicleStatusClick, handleLicensePlateClick } : {
    result: IVehicleDetail,
    handleDriverClick?: any,
    handleVehicleStatusClick?: any,
    handleLicensePlateClick?: any
}) {
    return (
        <div className='vehicle-detail-information w-full p-3 px-2 bg-gray-200 rounded-md text-slate-900'>
            <div className={"flex flex-col gap-2 md:gap-3"}>
                <VehicleBadges result={result} handleStatusClick={handleVehicleStatusClick} />
                <VehicleMainDetails result={result} handleLicensePlateClick={handleLicensePlateClick} />
                <VehicleDocuments result={result} />
                <VehicleDrivers result={result} handleClick={handleDriverClick}/>
            </div>
        </div>
    )
}

function VehicleMainDetails({ result, handleLicensePlateClick } : { 
    result : IVehicleDetail,
    handleLicensePlateClick: any
}) {    
    const vehicleColorItem = vehicleColor.filter(bs => bs.code === result.color.code)[0]

    return (
        <div className='vehicle-main-details'>
            <div className='flex flex-col gap-2 items-start justify-start'>
                <span className='hidden font-bold titles-font'>General</span>
                <div className='info-section'>
                    <div className='card-info-detail flex flex-col gap-2 items-start justify-start w-full'>
                        <div className='flex flex-row gap-1 items-center justify-start w-full'>
                            <span className='font-semibold'>Titular:</span>
                            <span>{ result.owner.first_name } { result.owner.last_name }</span>
                            <span>·</span>
                            <span className='font-semibold'>PPU:</span>
                            <span>{ result.license_plate }</span>
                            <span>·</span>
                            <span className='font-semibold'>Número de Móvil:</span>
                            <span>{ result.vehicle_number }</span>
                            <Button variant={'outline'} onClick={handleLicensePlateClick} className='ml-auto h-6 bg-slate-600 text-white text-xs'>
                                Buscar en MTT
                            </Button>
                        </div>
                        <div className='flex flex-row gap-1 items-center justify-start w-full'>
                            <span className='font-semibold'>Marca:</span>
                            <span>{ result.model.name }</span>
                            <span>·</span>
                            <span className='font-semibold'>Tipo:</span>
                            <span>{ result.type.name }</span>
                            { result.color.name && (
                                <Badge variant={'outline'} 
                                    className={cn('ml-4 text-white shadow-sm bg-gray-200 cursor-pointer', 
                                    `${vehicleColorItem.color}`
                                    )}>
                                    { result.color.name.toUpperCase() }
                                </Badge>
                            )}
                        </div>
                        <div className='flex flex-row gap-1 items-center justify-start w-full'>
                            <span className='font-semibold'>Contrato:</span>
                            <span>{ result.contract.type }</span>
                            <span>·</span>
                            <span className='font-semibold'>Sociedad:</span>
                            <span>{ result.contract.society_name }</span>
                        </div>
                        <div className='flex flex-row gap-1 items-center justify-start w-full'>
                            <span className='font-semibold'>Creación:</span>
                            <span>{new Date(result.creation_datetime).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function VehicleDocuments({ result } : { result : IVehicleDetail }) {
    return (
        <div className='vehicle-documents'>
            <div className='flex flex-col gap-2 items-start justify-start'>
                <span className='font-bold titles-font'>Documentos</span>
                <div className='info-section'>
                    { result.documents.permission_of_circulation && 
                        <div className='card-info-detail gap-12 w-full'>
                            <span className='font-semibold min-w-fit'>Permiso de Circulación</span>
                            { result.documents.permission_of_circulation.toUpperCase().includes('.PDF') && (
                                <iframe src={result.documents.permission_of_circulation} 
                                    className='w-full h-[150px]'
                                />
                            )}
                            { !result.documents.permission_of_circulation.toUpperCase().includes('.PDF') && (
                                <Zoom>
                                    <Image src={result.documents.permission_of_circulation} 
                                        width={1200} height={900} 
                                        className='h-10 w-auto'
                                        alt={result.license_plate} 
                                    />
                                </Zoom>
                            )}
                        </div>
                    }                        
                </div>
            </div>
        </div>
    )
}

function VehicleDrivers({ result, handleClick } : { 
    result : IVehicleDetail 
    handleClick: any
}) {
    return (
        <div className='vehicle-info-drivers flex flex-col gap-1 items-start justify-start'>
            <span className='font-bold titles-font'>Conductores: { result.drivers.length } </span>
            <ul className='info-section w-full flex flex-col gap-1 max-h-[250px] overflow-auto'>
                {
                    result.drivers.map((driver: IVehicleDetailDrivers) => 
                        <li key={driver.fleet_id} className='flex flex-row gap-2 w-full'>
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
    result : IVehicleDetail,
    handleStatusClick: any
}) {
    return (
        <div className='gap-2 flex flex-row items-center'>
            <VehicleStatusBadge result={result} />
            <ToolsButton item={result} handleClick={() => handleStatusClick({ result })} label={'Ver si el móvil está online'} />
            <CityBadge isCode={false} branch={result.branch} className='ml-auto' />
        </div>
    )
}