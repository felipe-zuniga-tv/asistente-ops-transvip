import { notFound } from 'next/navigation'
import { getBranchByCode } from '@/lib/services/admin'
import { getSalesResponsesByBranch } from '@/lib/services/sales'
import { SalesResponsesContent } from '@/components/sales/sales-responses-content'

interface SalesResponsesBranchPageProps {
  params: {
    branchCode: string;
  };
}

export default async function SalesResponsesBranchPage({ params }: SalesResponsesBranchPageProps) {
  const { branchCode } = params
  
  try {
    // Verify the branch exists
    const branch = await getBranchByCode(branchCode.toUpperCase())
    if (!branch) {
      return notFound()
    }
    
    // Get responses for this specific branch
    const branchResponses = await getSalesResponsesByBranch(branch.code)

    return (
      <SalesResponsesContent 
        initialResponses={branchResponses}
        branchName={branch.name}
      />
    )
  } catch (error) {
    console.error('Error fetching branch data:', error)
    return notFound()
  }
} 