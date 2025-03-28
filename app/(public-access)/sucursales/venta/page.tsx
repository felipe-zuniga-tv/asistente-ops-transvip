import SalesPageContent from '@/components/sales/sales-page-content'
import { getBranches } from '@/lib/services/admin'

export default async function SalesPage() {
	const branchesWithSalesForm = await getBranches(true)

	return (
		<SalesPageContent branches={branchesWithSalesForm} />
	)
} 