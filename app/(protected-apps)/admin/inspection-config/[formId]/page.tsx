import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getInspectionForm } from "@/lib/services/vehicle/inspection-forms";
import { InspectionFormEditor } from "@/components/admin/inspection/inspection-form-editor";
import SuspenseLoading from "@/components/ui/suspense";

interface InspectionFormPageProps {
    params: {
        formId: string;
    };
}

export async function generateMetadata({ params }: InspectionFormPageProps) {
    const form = await getInspectionForm(params.formId);
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
    const form = await getInspectionForm(formId);
    if (!form) return notFound();

    return <InspectionFormEditor form={form} />;
} 