import { FormContainer } from "@/app/(protected-apps)/forms/[formId]/page";
import SuspenseLoading from "@/components/ui/suspense";
import { Suspense } from "react";

export default function FormPage({ params }: { params: { formId: string } }) {
    return (
        <Suspense fallback={<SuspenseLoading />}>
            <FormContainer formId={params.formId} />
        </Suspense>
    );
}

