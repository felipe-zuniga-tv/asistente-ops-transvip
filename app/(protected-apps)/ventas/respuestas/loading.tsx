import { Card, CardContent, Skeleton } from "@/components/ui";

export default function SalesResponsesLoading() {
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