import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getOperationsFormById } from "@/lib/services/forms";
import { OperationsFormEditor } from "@/components/admin/forms/operations-form-editor";
import SuspenseLoading from "@/components/ui/suspense";

interface InspectionFormPageProps {
    params: {
        formId: string;
    };
}

export async function generateMetadata({ params }: InspectionFormPageProps) {
    const form = await getOperationsFormById(params.formId);
    if (!form) return notFound();

    return {
        title: `${form.title} | Transvip`,
        description: form.description,
    };
}

export default async function OperationsFormPage({ params }: InspectionFormPageProps) {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <OperationsFormEditorContainer formId={params.formId} />
        </Suspense>
    );
}

async function OperationsFormEditorContainer({ formId }: { formId: string }) {
    const form = await getOperationsFormById(formId);
    if (!form) return notFound();

    return <OperationsFormEditor form={form} />;
} 