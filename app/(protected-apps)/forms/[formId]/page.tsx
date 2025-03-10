import { Suspense } from "react";
import { notFound } from "next/navigation";
import SuspenseLoading from "@/components/ui/suspense";
import FormContainer from "@/components/forms/form-container";
import { getFormById } from "@/lib/services/forms";

interface FormPageProps {
    params: {
        formId: string;
    };
}

export async function generateMetadata({ params }: FormPageProps) {
    const form = await getFormById(params.formId);
    if (!form) return notFound();

    return {
        title: `${form.title} | Transvip`,
        description: form.description,
    };
}

export default async function FormPage({ params }: FormPageProps) {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <FormContainer formId={params.formId} />
        </Suspense>
    );
}