import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getFormById } from "@/lib/services/forms";
import { OperationsFormEditor } from "@/components/admin/forms/operations-form-editor";
import SuspenseLoading from "@/components/ui/suspense";

interface InspectionFormPageProps {
    params: {
        formId: string;
    };
}

export async function generateMetadata({ params }: InspectionFormPageProps) {
    const form = await getFormById(params.formId);
    if (!form) return notFound();

    return {
        title: `${form.title} | Configuración de Inspección | Transvip`,
        description: form.description,
    };
}

export default async function InspectionFormPage({ params }: InspectionFormPageProps) {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <InspectionFormEditorContainer formId={params.formId} />
        </Suspense>
    );
}

async function InspectionFormEditorContainer({ formId }: { formId: string }) {
    const form = await getFormById(formId);
    if (!form) return notFound();

    return <OperationsFormEditor form={form} />;
} 