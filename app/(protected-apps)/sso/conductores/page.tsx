import { Suspense } from 'react';
import { getDriversWithClearances, getAllDivisions } from '@/app/(protected-apps)/sso/lib/actions';
import { ConductoresClientContent } from './conductores-client'; // We'll create this next
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have a Skeleton component

export default async function ConductoresPage() {
  // Fetch data in the Server Component
  const driversDataPromise = getDriversWithClearances();
  const divisionsDataPromise = getAllDivisions();

  // A simple loading UI for the page itself, or for sections if preferred
  const PageSkeleton = () => (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  return (
    <div>
      <Suspense fallback={<PageSkeleton />}>
        <ConductoresDataResolver
          driversPromise={driversDataPromise}
          divisionsPromise={divisionsDataPromise}
        />
      </Suspense>
    </div>
  );
}

async function ConductoresDataResolver({
  driversPromise,
  divisionsPromise,
}: {
  driversPromise: ReturnType<typeof getDriversWithClearances>;
  divisionsPromise: ReturnType<typeof getAllDivisions>;
}) {
  // Await the promises here so Suspense can catch it
  const drivers = await driversPromise;
  const divisions = await divisionsPromise;

  return <ConductoresClientContent initialDrivers={drivers} allDivisions={divisions} />;
} 