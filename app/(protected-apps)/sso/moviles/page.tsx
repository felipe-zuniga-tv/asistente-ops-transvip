import { Suspense } from 'react';
import { getVehiclesWithClearances, getAllDivisions } from '@/app/(protected-apps)/sso/lib/actions';
import { MovilesClientContent } from './moviles-client'; // To be created
import { Skeleton } from '@/components/ui/skeleton';

export default async function MovilesPage() {
  const vehiclesDataPromise = getVehiclesWithClearances();
  const divisionsDataPromise = getAllDivisions();

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
        <MovilesDataResolver
          vehiclesPromise={vehiclesDataPromise}
          divisionsPromise={divisionsDataPromise}
        />
      </Suspense>
    </div>
  );
}

async function MovilesDataResolver({
  vehiclesPromise,
  divisionsPromise,
}: {
  vehiclesPromise: ReturnType<typeof getVehiclesWithClearances>;
  divisionsPromise: ReturnType<typeof getAllDivisions>;
}) {
  const vehicles = await vehiclesPromise;
  const divisions = await divisionsPromise;

  return <MovilesClientContent initialVehicles={vehicles} allDivisions={divisions} />;
} 