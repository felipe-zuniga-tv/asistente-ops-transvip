import { getBranches } from '@/lib/features/admin'
import { BranchSelectionGrid } from '@/components/sales/branch-selection-grid'

export default async function SalesResponsesPage() {
	const branches = await getBranches()

	return (
		<BranchSelectionGrid branches={branches} />
	)
} 