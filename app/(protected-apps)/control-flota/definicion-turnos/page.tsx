import { ShiftsDefinition } from "@/components/features/shifts/shifts-definition";
import { getShifts } from "@/lib/features/vehicle-shifts"

export default async function ShiftsDefinitionPage() {
	const shifts = await getShifts()
	return <ShiftsDefinition shifts={shifts} />
}