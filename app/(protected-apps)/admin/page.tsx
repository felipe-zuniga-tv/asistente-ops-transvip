import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Routes } from "@/utils/routes";
import { Settings, CreditCard, Car, Building2, Cog } from "lucide-react";
import { TransvipLogo } from '@/components/transvip/transvip-logo';
import { cn } from '@/lib/utils';

export const metadata = {
    title: "Panel de Administración | Transvip",
    description: "Panel de administración de configuraciones de Transvip",
};

const adminTools = [
    { name: 'Sucursales', href: Routes.ADMIN.BRANCHES_CONFIG, icon: Building2 },
    { name: 'Métodos de Pago', href: Routes.ADMIN.PAYMENT_METHODS_CONFIG, icon: CreditCard },
    { name: 'Estados de Vehículos', href: Routes.ADMIN.VEHICLE_STATUS_CONFIG, icon: Settings },
    { name: 'Tipos de Vehículos', href: Routes.ADMIN.VEHICLE_TYPES_CONFIG, icon: Car },
    { name: 'Configuración Sistema', href: Routes.ADMIN.SYSTEM_CONFIG, icon: Cog },
];

export const revalidate = 0;

export default function AdminPage() {
    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row items-center gap-2">
                        <TransvipLogo size={20} />
                        <span>Panel de Administración</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {adminTools.map((tool) => (
                        <Link key={tool.href} href={tool.href} className='block transition-transform hover:scale-[1.02]'>
                            <Card className={cn(
                                "h-full transition-shadow duration-200",
                                "bg-transvip/50 hover:bg-transvip-dark/20 text-black border-0"
                            )}>
                                <CardHeader>
                                    <CardTitle className="text-center text-xl font-semibold flex flex-col items-center justify-center gap-2">
                                        <tool.icon className="h-6 w-6" />
                                        {tool.name}
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 