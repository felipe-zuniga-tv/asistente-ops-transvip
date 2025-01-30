'use client'

import * as React from 'react'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { branches } from '@/lib/config/transvip-general'
import { SalesForm } from '@/components/sales/form/sales-form'
import type { Language } from '@/lib/translations'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Routes } from '@/utils/routes'

function SalesPageSkeleton() {
	return (
		<div className="container max-w-2xl mx-auto p-4 sm:py-8">
			<Card>
				<CardContent className="pt-6">
					<Skeleton className="h-2 w-full mb-4" />
					<div className="flex justify-center mb-4">
						<Skeleton className="h-8 w-32" />
					</div>
					<div className="space-y-6">
						<div className="space-y-2">
							<Skeleton className="h-8 w-3/4 mx-auto" />
							<Skeleton className="h-4 w-2/3 mx-auto" />
						</div>
						<div className="space-y-4">
							<div>
								<Skeleton className="h-4 w-24 mb-2" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div>
								<Skeleton className="h-4 w-24 mb-2" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div>
								<Skeleton className="h-4 w-24 mb-2" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div className="flex gap-3 pt-4">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter className="bg-gray-200 rounded-b-lg p-0">
					<div className="w-full flex items-center justify-center text-sm text-black p-3">
						<Skeleton className="h-4 w-32" />
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}

function SalesPageContent() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const branchCode = searchParams.get('branch')?.toLowerCase()
	const language = (searchParams.get('lang') || 'es-CL') as Language

	useEffect(() => {
		// Validate branch code
		const validBranch = branches.some(b => b.code.toLowerCase() === branchCode)
		if (!branchCode || !validBranch) {
			router.push(Routes.SALES.HOME)
		}
	}, [branchCode, router])

	// If no valid branch code, show nothing while redirecting
	if (!branchCode) return null

	return (
		<SalesForm
			branchCode={branchCode}
			initialLanguage={language}
			onSuccess={() => router.push(Routes.SALES.HOME)}
		/>
	)
}

export default function SalesPage() {
	return (
		<Suspense fallback={<SalesPageSkeleton />}>
			<SalesPageContent />
		</Suspense>
	)
} 