import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getOperationsFormById } from "@/lib/features/forms";
import { OperationsFormEditor } from "@/components/features/admin/forms/operations-form-editor";
import SuspenseLoading from "@/components/ui/suspense";

interface InspectionFormPageProps {
    params: Promise<{
        formId: string;
    }>;
}

export async function generateMetadata(props: InspectionFormPageProps) {
    const params = await props.params;
    const form = await getOperationsFormById(params.formId);
    if (!form) return notFound();

    return {
        title: `${form.title} | Transvip`,
        description: form.description,
    };
}

export default async function OperationsFormPage(props: InspectionFormPageProps) {
    const params = await props.params;
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