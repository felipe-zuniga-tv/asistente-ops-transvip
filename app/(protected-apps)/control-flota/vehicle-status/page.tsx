import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { TransvipLogo } from '@/components/transvip/transvip-logo';
import { VehicleStatus } from "@/components/vehicle-status/vehicle-status";
import { getVehicleStatuses } from '@/lib/database/actions';

export default async function VehicleStatusPage() {
    const statuses = await getVehicleStatuses()

    return (
        <Card className="max-w-4xl mx-2 lg:mx-auto">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row items-center gap-2">
                        <TransvipLogo size={20} />
                        <span>Estado por Móvil</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <VehicleStatus statuses={statuses} />
            </CardContent>
        </Card>
    );
} 