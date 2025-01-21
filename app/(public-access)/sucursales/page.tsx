'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { branches } from '@/lib/config/transvip-general'
import { TransvipLogo } from '@/components/transvip/transvip-logo'
import Link from 'next/link'
import { getTranslation, type Language } from '@/lib/translations'
import { languages } from '@/components/sales/form/language-step'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function BranchesPage() {
	const router = useRouter()
	const [language, setLanguage] = useState<Language>('es-CL')
	const t = getTranslation(language)

	return (
		<Card>
			<CardHeader className="flex flex-col sm:flex-row gap-2 items-center justify-between border-b pb-6">
				<div className="flex items-center gap-4">
					<TransvipLogo size={25} />
					<CardTitle className="text-2xl font-bold">Transvip</CardTitle>
				</div>
				<Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
					<SelectTrigger className="w-[180px]">
						<SelectValue>
							{languages.find(lang => lang.value === language)?.flag} {languages.find(lang => lang.value === language)?.label}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{languages.map((lang) => (
							<SelectItem key={lang.value} value={lang.value}>
								<span className="flex items-center gap-2">
									<span className="text-lg">{lang.flag}</span>
									<span>{lang.label}</span>
								</span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="p-8 flex flex-col gap-8 items-center justify-center w-full">
				<div className="flex flex-col gap-2 items-center justify-center">
					<h1 className="text-2xl font-bold">{t.branches.title}</h1>
					<div className="text-muted-foreground text-center">
						{t.branches.description}
					</div>
				</div>

				<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
					{branches.map((branch) => (
						<Link
							key={branch.branch_id}
							href={`/sucursales/venta?branch=${branch.code.toLowerCase()}&lang=${language}`}
							className="block transition-transform hover:scale-[1.02]"
						>
							<Card className="h-full hover:bg-accent/50 transition-colors">
								<CardHeader className="text-center">
									<CardTitle className="text-2xl font-bold">{branch.name}</CardTitle>
								</CardHeader>
							</Card>
						</Link>
					))}
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
