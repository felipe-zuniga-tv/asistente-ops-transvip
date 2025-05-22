'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Routes } from '@/utils/routes'
import { Language } from '@/lib/core/i18n'
import { getSalesResponses, getBranches } from "@/lib/features/sales";
import { SalesResponsesTable } from "./sales-responses-table";
import type { Branch } from "@/types/domain/admin/types";
import { SalesForm } from './form/sales-form'

export default function SalesPageContent({ branches }: { branches: Branch[] }) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const branchCode = searchParams.get('branch')?.toLowerCase() || ''
	const language = (searchParams.get('lang') || 'es-CL') as Language
	
	const branch = branches.find(b => b.code.toLowerCase() === branchCode)

	useEffect(() => {
		// Validate branch code
		if (!branch) {
			router.push(Routes.PUBLIC.SUCURSALES)
		}
	}, [branch, router])

	// If no valid branch code, show nothing while redirecting
	if (!branch) return null

	return (
		<SalesForm
			branchCode={branchCode.toUpperCase()}
			branchName={branch.name}
			initialLanguage={language}
			onSuccess={() => router.push(Routes.PUBLIC.SUCURSALES)}
		/>
	)
}