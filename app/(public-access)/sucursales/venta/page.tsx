import { getBranches } from '@/lib/features/admin'
import SalesPageContent from '@/components/features/sales/sales-page-content'

export default async function SalesPage() {
	const branchesWithSalesForm = await getBranches(true)

	return (
		<SalesPageContent branches={branchesWithSalesForm} />
	)
} 