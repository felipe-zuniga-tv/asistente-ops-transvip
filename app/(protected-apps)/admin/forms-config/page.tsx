import { Suspense } from "react";
import { OperationsFormsConfiguration } from "@/components/admin/forms/operations-forms-config";
import { getForms } from "@/lib/services/forms";
import SuspenseLoading from "@/components/ui/suspense";

export const metadata = {
    title: 'Configuración de Formularios | Transvip',
    description: 'Administra los formularios de operaciones en Transvip',
}

export default async function FormsConfigPage() {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <FormsConfigDashboard />
        </Suspense>
    );
}

async function FormsConfigDashboard() {
    const forms = await getForms();
    return <OperationsFormsConfiguration data={forms} />;
} 