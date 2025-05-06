import FormContainer from "@/components/ui/forms/form-container";
import SuspenseLoading from "@/components/ui/suspense";
import { Suspense } from "react";

export default async function FormPage(props: { params: Promise<{ formId: string }> }) {
    const params = await props.params;
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <FormContainer formId={params.formId} />
        </Suspense>
    );
}

