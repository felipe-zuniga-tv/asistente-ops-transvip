import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Routes } from '@/utils/routes';
import { TransvipLogo } from '@/components/features/transvip/transvip-logo';
import { Calendar, CalendarClock, Car, AlertTriangle } from 'lucide-react';

const menuItems = [
    {
        title: "Definición de Jornadas",
        description: "Jornadas de Conexión de la Flota",
        content: "Comprueba acá las diferentes opciones de turno que existen para la flota",
        icon: CalendarClock,
        href: Routes.CONTROL_FLOTA.SHIFTS
    },
    {
        title: "Jornadas por Móvil",
        description: "Define qué jornadas tendrá cada móvil",
        content: "Asocia una jornada de conexión a cada móvil de la flota",
        icon: Car,
        href: Routes.CONTROL_FLOTA.VEHICLE_SHIFT
    },
    {
        title: "Calendario de Jornadas",
        description: "Verifica la asociación de jornadas con fechas",
        content: "Calendario para verificar la asociación de jornadas para cada vehículo de la flota.",
        icon: Calendar,
        href: Routes.CONTROL_FLOTA.SHIFTS_PER_VEHICLE
    },
    {
        title: "Estado por Móvil",
        description: "Registra estados especiales de los móviles",
        content: "Mantén un registro de estados como mantenciones, accidentes, vacaciones, etc.",
        icon: AlertTriangle,
        href: Routes.CONTROL_FLOTA.VEHICLE_STATUS
    },
    {
        title: "Jornadas de la Flota",
        description: "Qué vehículos tienen turnos en cada fecha",
        content: "Calendario para verificar los vehículos que tienen turnos en una fecha específica",
        icon: Calendar,
        href: Routes.CONTROL_FLOTA.FLEET_SHIFTS_CALENDAR
    }
];

export default function ControlFlotaPage() {
    return (
        <Card className="mx-2 mt-4 lg:mx-auto">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row items-center gap-2">
                        <TransvipLogo size={20} />
                        <span>Control de Flota</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <Link key={index} href={item.href} className="block hover:opacity-90 hover:scale-105 transition-all duration-100">
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex flex-row gap-2 items-center'>
                                        <Icon className='w-4 h-4 text-transvip' />
                                        <span>{item.title}</span>
                                    </CardTitle>
                                    <CardDescription className='text-xs'>{item.description}</CardDescription>
                                </CardHeader>
                                <CardContent className='text-sm'>
                                    {item.content}
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </CardContent>
        </Card>
    );
}