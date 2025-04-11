import { Suspense } from "react";
import SuspenseLoading from "@/components/ui/suspense";
import { getOperationsForms } from "@/lib/services/forms";
import { Routes } from "@/utils/routes";
import { FormulariosContent } from "@/components/ui/forms/forms-content";

export default async function PublicFormulariosPage() {
    const forms = await getOperationsForms();
	const activeForms = forms.filter(form => form.is_active);

	return (
		<Suspense fallback={<SuspenseLoading />}>
			<FormulariosContent activeForms={activeForms} baseUrl={Routes.PUBLIC.FORMULARIOS} />
		</Suspense>
	);
}