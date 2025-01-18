import { ShiftsDefinition } from "@/components/shifts/shifts-definition";
import { getShifts } from "@/lib/database/actions";

export const revalidate = 0;

export default async function ShiftsDefinitionPage() {
  const shifts = await getShifts();

  return <ShiftsDefinition shifts={shifts} />
}