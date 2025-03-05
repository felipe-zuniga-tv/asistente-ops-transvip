import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Routes } from "@/utils/routes";
import { getFormById, createFormResponse } from "@/lib/services/forms";
import { FormResponse } from "@/components/forms/form-response";
import SuspenseLoading from "@/components/ui/suspense";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TransvipLogo } from "@/components/transvip/transvip-logo";

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

export async function FormContainer({ formId }: { formId: string }) {
    const form = await getFormById(formId);
    if (!form) return notFound();

    // Generate a unique response ID and create the form response
    const responseId = uuidv4();
    await createFormResponse({
        id: responseId,
        form_id: formId
    });

    // Initialize empty answers for each question
    const answers: Record<string, { value: string }> = {};
    form.sections.forEach(section => {
        section.questions.forEach(question => {
            answers[question.id] = { value: "" };
        });
    });

    return (
        <div className="max-w-lg mx-auto">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                        <Link href={Routes.PUBLIC.FORMULARIOS}>
                            <TransvipLogo size={30} />
                        </Link>
                    </div>
                    
                    <FormResponse
                        formId={form.id}
                        responseId={responseId}
                        sections={form.sections}
                        answers={answers}
                    />
                </CardContent>
                <CardFooter className="bg-gray-200 rounded-b-lg p-0">
                    <div className="w-full flex items-center justify-center text-sm text-black p-3">
                        © {new Date().getFullYear()} · Transvip
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
} 