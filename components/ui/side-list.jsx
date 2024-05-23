import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { ArrowRightCircle } from "lucide-react";

export default function SidebarList({ className }) {
    return (
        <div className={cn("hidden md:block overflow-auto border-l border-gray-200 dark:border-gray-800", className)}>
            <div className="p-6 py-4 text-white">
                <h2 className="text-xl font-bold">Mis Herramientas</h2>
            </div>
            <div className="grid gap-4 p-4 pt-0">
                <Card>
                    <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium">Ver la conexión de un Móvil</h3>
                            <Button size="sm" variant="outline">
                                <ArrowRightCircle className="h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium">Ver próximas reservas</h3>
                            <Button size="sm" variant="outline">
                                <ArrowRightCircle className="h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium">Perfil de un conductor</h3>
                            <Button size="sm" variant="outline">
                                <ArrowRightCircle className="h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}