import Link from "next/link";
import { notFound } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createFormResponse, getOperationsFormById } from "@/lib/services/forms";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui";
import { Routes } from "@/utils/routes";
import { TransvipLogo } from "@/components/features/transvip/transvip-logo";
import { FormResponse } from "./form-response";

export default async function FormContainer({ formId }: { formId: string }) {
    const form = await getOperationsFormById(formId);
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
                <CardHeader>
                    <div className="flex justify-center">
                        <Link href={Routes.PUBLIC.FORMULARIOS}>
                            <TransvipLogo size={24} />
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
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