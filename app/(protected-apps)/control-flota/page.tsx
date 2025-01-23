import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Routes } from '@/utils/routes';
import { TransvipLogo } from '@/components/transvip/transvip-logo';
import { Calendar, CalendarClock, Car, AlertTriangle } from 'lucide-react';

export default function ControlFlotaPage() {
    return (
        <Card className="max-w-3xl mx-2 mt-4 lg:mx-auto">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row items-center gap-2">
                        <TransvipLogo size={20} />
                        <span>Control de Flota</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Link href={Routes.CONTROL_FLOTA.SHIFTS} className="block hover:opacity-90">
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex flex-row gap-2 items-center'>
                                <CalendarClock className='w-4 h-4 text-transvip' />
                                <span>Definición de Jornadas</span>
                            </CardTitle>
                            <CardDescription className='text-xs'>Jornadas de Conexión de la Flota</CardDescription>
                        </CardHeader>
                        <CardContent className='text-sm'>
                            Comprueba acá las diferentes opciones de turno que existen para la flota
                        </CardContent>
                    </Card>
                </Link>

                <Link href={Routes.CONTROL_FLOTA.VEHICLE_SHIFT} className="block hover:opacity-90">
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex flex-row gap-2 items-center'>
                                <Car className='w-4 h-4 text-transvip' />
                                <span>Jornadas por Móvil</span>
                            </CardTitle>
                            <CardDescription className='text-xs'>Define qué jornadas tendrá cada móvil</CardDescription>
                        </CardHeader>
                        <CardContent className='text-sm'>
                            Asocia una jornada de conexión a cada móvil de la flota
                        </CardContent>
                    </Card>
                </Link>

                <Link href={Routes.CONTROL_FLOTA.DASHBOARD} className="block hover:opacity-90">
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex flex-row gap-2 items-center'>
                                <Calendar className='w-4 h-4 text-transvip' />
                                <span>Calendario de Jornadas</span>
                            </CardTitle>
                            <CardDescription className='text-xs'>Verifica la asociación de jornadas con fechas</CardDescription>
                        </CardHeader>
                        <CardContent className='text-sm'>
                            Calendario para verificar la asociación de jornadas para cada vehículo de la flota.
                        </CardContent>
                    </Card>
                </Link>

                <Link href={Routes.CONTROL_FLOTA.VEHICLE_STATUS} className="block hover:opacity-90">
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex flex-row gap-2 items-center'>
                                <AlertTriangle className='w-4 h-4 text-transvip' />
                                <span>Estado por Móvil</span>
                            </CardTitle>
                            <CardDescription className='text-xs'>Registra estados especiales de los móviles</CardDescription>
                        </CardHeader>
                        <CardContent className='text-sm'>
                            Mantén un registro de estados como mantenciones, accidentes, vacaciones, etc.
                        </CardContent>
                    </Card>
                </Link>
            </CardContent>
        </Card>
    );
}