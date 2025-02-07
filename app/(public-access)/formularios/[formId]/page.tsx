import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getFormById } from "@/lib/services/forms";
import { FormResponse } from "@/components/forms/form-response";
import SuspenseLoading from "@/components/ui/suspense";

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

async function FormContainer({ formId }: { formId: string }) {
    const form = await getFormById(formId);
    if (!form) return notFound();

    // Initialize empty answers for each question
    const answers: Record<string, { value: string }> = {};
    form.sections.forEach(section => {
        section.questions.forEach(question => {
            answers[question.id] = { value: "" };
        });
    });

    return (
        <div className="max-w-screen-lg mx-auto py-3 px-4">
            <FormResponse
                formId={form.id}
                sections={form.sections}
                answers={answers}
            />
        </div>
    );
} 