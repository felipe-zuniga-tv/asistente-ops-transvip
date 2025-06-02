import { getMiningDivisions } from '@/lib/features/admin';
import { MiningDivisionsConfig } from '@/components/features/admin/mining-divisions-config/mining-divisions-config';

export const metadata = {
    title: 'Divisiones Mineras | Transvip',
    description: 'Administra las divisiones mineras en Transvip',
};

export const revalidate = 60;

export default async function MiningDivisionsPage() {
    // const miningDivisions = await getMiningDivisions(); // Placeholder for data fetching
    return <MiningDivisionsConfig data={[]} />; // Passing empty array for now
} 