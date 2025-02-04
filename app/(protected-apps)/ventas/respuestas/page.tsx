import { Suspense } from 'react'
import { getSalesResponses } from '@/lib/services/sales'
import { SalesResponsesContent } from '@/components/sales/sales-responses-content'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function SalesResponsesSkeleton() {
	return (
		<div className="container mx-auto py-10">
			<div className="flex flex-col gap-6">
				<div>
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-4 w-96 mt-2" />
				</div>
				<Card>
					<CardContent className="p-6">
						<div className="space-y-4">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default async function SalesResponsesPage() {
	const initialResponses = await getSalesResponses()

	return (
		<Suspense fallback={<SalesResponsesSkeleton />}>
			<SalesResponsesContent 
				initialResponses={initialResponses}
			/>
		</Suspense>
	)
} 