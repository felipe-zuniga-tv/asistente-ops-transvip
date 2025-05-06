import { Suspense } from "react";
import { getOperationsForms } from "@/lib/features/forms";
import { Routes } from "@/utils/routes";
import { FormulariosContent } from "@/components/ui/forms/forms-content";
import SuspenseLoading from "@/components/ui/suspense";

export const metadata = {
	title: 'Formularios | Transvip',
	description: 'Responde a los formularios de operaciones en Transvip',
}

export default async function FormulariosPage() {
	const forms = await getOperationsForms();
	const activeForms = forms.filter(form => form.is_active);

	return (
		<Suspense fallback={<SuspenseLoading />}>
			<FormulariosContent activeForms={activeForms} baseUrl={Routes.OPERATIONS_FORMS.HOME} />
		</Suspense>
	);
}