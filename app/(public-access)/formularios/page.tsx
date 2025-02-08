import { Suspense } from "react";
import SuspenseLoading from "@/components/ui/suspense";
import { getForms } from "@/lib/services/forms";
import { Routes } from "@/utils/routes";
import { FormulariosContent } from "@/app/(protected-apps)/forms/page";

export default async function FormulariosPage() {
    const forms = await getForms();
	const activeForms = forms.filter(form => form.is_active);

	return (
		<Suspense fallback={<SuspenseLoading />}>
			<FormulariosContent activeForms={activeForms} baseUrl={Routes.PUBLIC.FORMULARIOS} />
		</Suspense>
	);
}