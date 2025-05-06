import { Suspense } from "react";
import { notFound } from "next/navigation";
import SuspenseLoading from "@/components/ui/suspense";
import FormContainer from "@/components/ui/forms/form-container";
import { getOperationsFormById } from "@/lib/features/forms";

interface FormPageProps {
    params: Promise<{
        formId: string;
    }>;
}

export async function generateMetadata(props: FormPageProps) {
    const params = await props.params;
    const form = await getOperationsFormById(params.formId);
    if (!form) return notFound();

    return {
        title: `${form.title} | Transvip`,
        description: form.description,
    };
}

export default async function FormPage(props: FormPageProps) {
    const params = await props.params;
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <FormContainer formId={params.formId} />
        </Suspense>
    );
}