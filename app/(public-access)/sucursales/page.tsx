import { Suspense } from 'react'
import { getBranches } from '@/lib/features/admin'
import { LanguageSelector } from '@/components/features/sales/language-selector'
import { BranchesList } from '@/components/features/sales/branches-list'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { TransvipLogo } from '@/components/features/transvip/transvip-logo'
import { getTranslation, type Language } from '@/lib/core/i18n'

export default async function BranchesPage(props: { searchParams: Promise<{ lang?: string }> }) {
	const searchParams = await props.searchParams;
	const language = (searchParams.lang || 'es-CL') as Language
	const t = getTranslation(language)
	const salesFormActiveFilter = true
	const branchesWithSalesForm = await getBranches(salesFormActiveFilter)

	return (
		<Card>
			<CardHeader className="border-b pb-6 flex flex-row justify-center items-center gap-2 space-y-0">
				<TransvipLogo size={20} />
				<CardTitle className="text-2xl font-bold">Transvip</CardTitle>
			</CardHeader>
			<CardContent className="p-8 py-6 flex flex-col gap-6 items-center justify-center w-full">
				<div className="flex flex-col gap-2 items-center justify-center">
					<span className="text-2xl font-bold">{t.branches.title}</span>
					<div className="text-muted-foreground text-center">
						{t.branches.description}
					</div>
				</div>

				<div className="flex flex-col md:flex-row gap-1 md:gap-4 items-center justify-center w-full">
					<span className="text-sm text-muted-foreground">{t.branches.selectLanguage}</span>
					<LanguageSelector language={language} />
				</div>

				<div className="w-full flex flex-col gap-6">
					<BranchesList branches={branchesWithSalesForm} t={t.branches} language={language} />
				</div>
			</CardContent>
			<CardFooter className="bg-gray-200 rounded-b-lg p-0">
				<div className="w-full flex items-center justify-center text-sm text-black p-3">
					© {new Date().getFullYear()} · Transvip
				</div>
			</CardFooter>
		</Card>
	)
}
