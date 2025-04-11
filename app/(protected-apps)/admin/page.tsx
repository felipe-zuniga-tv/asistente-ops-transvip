import Link from "next/link";
import { Routes } from "@/utils/routes";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, CreditCard, Car, Building2, Cog } from "lucide-react";
import { cn } from '@/utils/ui';
import { ConfigCardContainer } from "@/components/ui/tables/config-card-container";

export const metadata = {
    title: "Panel de Administración | Transvip",
    description: "Panel de administración de configuraciones de Transvip",
};

const adminTools = [
    { name: 'Control de Acceso', active: true, href: Routes.ADMIN.ACCESS_CONTROL, icon: Settings },
    { name: 'Sucursales', active: true, href: Routes.ADMIN.BRANCHES_CONFIG, icon: Building2 },
    { name: 'Métodos de Pago', active: true, href: Routes.ADMIN.PAYMENT_METHODS_CONFIG, icon: CreditCard },
    { name: 'Estados de Vehículos', active: true, href: Routes.ADMIN.VEHICLE_STATUS_CONFIG, icon: Settings },
    { name: 'Tipos de Vehículos', active: true, href: Routes.ADMIN.VEHICLE_TYPES_CONFIG, icon: Car },
    { name: 'Configuración Sistema', active: false, href: Routes.ADMIN.SYSTEM_CONFIG, icon: Cog },
];

export const revalidate = 60;

export default function AdminPage() {
    return (
        <ConfigCardContainer 
            title="Panel de Administración"
            className="w-full max-w-full mx-0"
        >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {adminTools.map((tool) => {
                    const CardContent = (
                        <Card className={cn(
                            "h-full transition-shadow duration-200",
                            "bg-gray-50 hover:bg-white/80 text-black border-transvip/50",
                            !tool.active && "opacity-50"
                        )}>
                            <CardHeader>
                                <CardTitle className="text-center text-xl font-semibold flex flex-col items-center justify-center gap-2">
                                    <tool.icon className="h-6 w-6" />
                                    {tool.name}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    );

                    return tool.active ? (
                        <Link 
                            key={tool.href} 
                            href={tool.href}
                            className='block transition-transform hover:scale-[1.02]'
                        >
                            {CardContent}
                        </Link>
                    ) : (
                        <div 
                            key={tool.href}
                            className="block"
                            aria-disabled="true"
                        >
                            {CardContent}
                        </div>
                    );
                })}
            </div>
        </ConfigCardContainer>
    );
} 