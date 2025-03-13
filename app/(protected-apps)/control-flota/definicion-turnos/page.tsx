import { ShiftsDefinition } from "@/components/shifts/shifts-definition";
import SuspenseLoading from "@/components/ui/suspense";
import { getShifts } from "@/lib/services/database/actions";
import { Suspense } from "react";

export const revalidate = 0;

export default async function ShiftsDefinitionPage() {
  const shifts = await getShifts()
  
  return (
    <Suspense fallback={<SuspenseLoading />}>
      <ShiftsDefinition shifts={shifts} />
    </Suspense>
  );
}