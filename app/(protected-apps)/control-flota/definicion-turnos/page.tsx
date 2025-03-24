import { Suspense } from "react";
import SuspenseLoading from "@/components/ui/suspense";
import { ShiftsDefinition } from "@/components/shifts/shifts-definition";
import { getShifts } from "@/lib/services/database/actions";

async function ShiftsDefinitionPageContent() {
	const shifts = await getShifts()
	return <ShiftsDefinition shifts={shifts} />
}

export default async function ShiftsDefinitionPage() {
	return (
		<Suspense fallback={<SuspenseLoading />}>
			<ShiftsDefinitionPageContent />
		</Suspense>
	)
}