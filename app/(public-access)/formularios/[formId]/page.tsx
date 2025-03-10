import FormContainer from "@/components/forms/form-container";
import SuspenseLoading from "@/components/ui/suspense";
import { Suspense } from "react";

export default function FormPage({ params }: { params: { formId: string } }) {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <FormContainer formId={params.formId} />
        </Suspense>
    );
}

