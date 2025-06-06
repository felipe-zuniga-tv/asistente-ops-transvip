'use client'
import Image from 'next/image';
import { cn } from '@/utils/ui';
import { useMessageSubmission } from '@/hooks/use-message-submission';
import { CheckCircle, SparklesIcon } from 'lucide-react';
import { AssistantMessageContent } from '../message';
import { IVehicleStatusSearchResult } from '@/types/domain/vehicle/types';
import { VEHICLE_STATUS } from '@/utils/constants';
import { Button } from '@/components/ui';
import ToolsButton from '../tools/tools-button';
import DriverAvatar from '@/components/features/drivers/driver-avatar';
import { CityBadge } from '../badges/chat-badges';

export interface VehicleStatusSearchResults {
    map(arg0: (result: IVehicleStatusSearchResult) => import("react").JSX.Element): import("react").ReactNode;
    searchResults: IVehicleStatusSearchResult[];
}

export function VehicleStatusSearch({ session, searchResults, content }: { 
    session?: any,
    searchResults: VehicleStatusSearchResults, 
    content: string 
}) {
    const { submitMessage } = useMessageSubmission()

    const handleClick = async (result : IVehicleStatusSearchResult, request: string) => {
        let userMessageContent = ""
        if (request === 'booking') {
            userMessageContent = `Me gustaría saber más detalles de la reserva ${result.job_id}.`
        } else if (request === 'vehicle') {
            userMessageContent = `Me gustaría saber más información sobre el vehículo con patente ${result.license_plate}.`
        } else {
            userMessageContent = `Me gustaría saber más información sobre el vehículo con patente ${result.license_plate}.`
        }

        await submitMessage(userMessageContent, session);
    }

    return (
        <div className="flex flex-col gap-2">
            <div className='flex flex-row gap-2 items-center justify-start'>
                <SparklesIcon className='h-4' />
                <span className='font-bold'>Resultados</span>
            </div>
            <div className={'search-results-cards relative w-full flex gap-4 snap-x overflow-x-auto'}>
                { searchResults.map((result) => (
                    <VehicleStatusResultsCard key={result.vehicle_number} result={result} handleClick={handleClick} />
                ))}
            </div>
            { content && <div className='search-results-text mt-4'>
                <AssistantMessageContent content={content} />
            </div>}
        </div>
    )
}

function VehicleStatusResultsCard({ result, handleClick } : { 
    result: IVehicleStatusSearchResult
    handleClick: any 
}) {
    const currentStatus = (result.status === VEHICLE_STATUS.ONLINE_AVAILABLE || result.status === VEHICLE_STATUS.ONLINE_BUSY) ? 'ONLINE' : 'OFFLINE'

    return (
        <div className='search-results-card w-full'>
            <div className={cn(
                'h-fit p-3 flex flex-col gap-2 md:gap-4 justify-between text-white rounded-xl hover:text-white',
                `${currentStatus === 'ONLINE' ? 'bg-emerald-700' : 'bg-red-400' }`
            )}>
                <VehicleStatusHeader result={result} />
                <div className='result-booking flex flex-col justify-between items-start gap-1 detail-info-font'>
                    { !result.job_id && <span className="">Sin Reserva Activa</span>}
                    { result.job_id && (
                        <>
                            <span className="font-semibold">Reserva</span>
                            <div className='flex flex-row gap-2 items-center justify-start'>
                                <span className="">{result.job_id}</span>
                                <span className="">·</span>
                                <span className="">{result.service_name}</span>
                                <span className="">·</span>
                                <span className="">{result.contract_name}</span>
                                <Button variant={'default'} className='ml-4 text-xs text-white py-[1px] h-7 bg-slate-600'
                                    onClick={() => handleClick(result, 'booking')}>
                                        Buscar reserva
                                </Button>
                            </div>
                        </>
                    )}
                </div>
                <VehicleStatusBadges result={result} currentStatus={currentStatus} handleDetailClick={handleClick} />
            </div>
        </div>
    )
}

function VehicleStatusHeader({ result }: {
    result: IVehicleStatusSearchResult
}) {
    return (
        <div className='result-fleet-header flex flex-row items-center justify-start gap-4'>
            <div className='fleet-profile-img'>
                { result.fleet_image &&
                    <DriverAvatar url={result.fleet_image} alt={result.first_name} />
                }
            </div>
            <div className='flex flex-col gap-1 items-start'>
                { result.driver_name && <span className='font-bold titles-font'>{ result.driver_name }</span>}
                <div className='flex flex-row gap-1 items-center justify-start font-normal detail-info-font'>
                    { result.vehicle_number && (
                        <div className='flex flex-row gap-1 items-center'>
                            <span className='font-bold'>Móvil:</span>
                            <span className=''>{ result.vehicle_number }</span>
                        </div>
                    )}
                    <span>·</span>
                    { result.license_plate && (
                        <div className='flex flex-row gap-1 items-center'>
                            <span className='font-bold'>PPU:</span>
                            <span>{ result.license_plate }</span>
                        </div>
                    )}
                </div>
                { result.email && <span className='hidden font-semibold text-xs'>{ result.email }</span>}
                { result.phone_number && <span className='hidden font-semibold text-xs'>{ result.phone_number }</span>}
            </div>
            
        </div>
    )
}

function VehicleStatusBadges({ result, currentStatus, handleDetailClick }: {
    result: IVehicleStatusSearchResult
    currentStatus: string
    handleDetailClick: any
}) {
    return (
        <div className='result-status w-full flex flex-row gap-2 md:gap-4 items-center justify-between'>
            <div className='flex flex-row items-center justify-start gap-2'>
                { result.branch && <CityBadge branch={result.branch} /> }
                <ToolsButton item={result} handleClick={() => handleDetailClick(result, 'vehicle')} label={'Ver más detalles'} />
            </div>
            { currentStatus === 'ONLINE' && <div className='text-xs'><CheckCircle className='h-4' /></div> }
            { currentStatus === 'OFFLINE' && 
                <Button className='h-8 bg-green-400 hover:bg-green-600 text-white'>
                    <Image src={'/images/whatsapp-logo.svg'} 
                        width={100} height={100}
                        className='h-4 w-4 text-white'
                        alt='Whatsapp'
                    />
                </Button> 
            }
        </div>
    )
}