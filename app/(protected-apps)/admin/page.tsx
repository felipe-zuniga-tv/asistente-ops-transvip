import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Routes } from "@/utils/routes";
import Link from "next/link";
import { Settings, Sliders } from "lucide-react";

export const metadata: Metadata = {
    title: "Panel de Administración | Transvip",
    description: "Panel de administración de configuraciones de Transvip",
};

export default function AdminPage() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href={Routes.ADMIN.VEHICLE_STATUS_CONFIG}>
                <Card className="hover:bg-accent/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sliders className="h-5 w-5" />
                            <span>Estados de Vehículos</span>
                        </CardTitle>
                        <CardDescription>
                            Configura los estados disponibles para los vehículos
                        </CardDescription>
                    </CardHeader>
                </Card>
            </Link>
        </div>
    );
} 