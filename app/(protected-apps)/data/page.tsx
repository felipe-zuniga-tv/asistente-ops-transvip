import { nanoid } from "@/utils/id";
import { getSession } from "@/lib/core/auth";

export default async function DataAnalysisTools() {
	const session = await getSession()

	return (
		<div className="h-full flex flex-col gap-4 items-center">
			Hola, herramientas de datos
		</div>
	);
}
