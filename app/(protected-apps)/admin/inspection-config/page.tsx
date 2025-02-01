import { Suspense } from "react";
import { InspectionFormsList } from "@/components/admin/inspection/inspection-forms-list";
import { getInspectionForms } from "@/lib/services/vehicle/inspection-forms";
import SuspenseLoading from "@/components/ui/suspense";

export const metadata = {
    title: 'Configuración de Inspección de Vehículos | Transvip',
    description: 'Administra los formularios de inspección de vehículos en Transvip',
}

export default async function InspectionConfigPage() {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <InspectionConfigDashboard />
        </Suspense>
    );
}

async function InspectionConfigDashboard() {
    const forms = await getInspectionForms();
    return <InspectionFormsList data={forms} />;
} 