import { ShiftsCard } from "@/components/shifts/shifts-content";
import { getShifts } from "@/lib/database/actions";

export const revalidate = 0;

export default async function ShiftsDefinitionPage() {
  const shifts = await getShifts();

  return (
    <div className="py-6 px-2 md:px-4">
      <ShiftsCard shifts={shifts} />
    </div>
  );
}