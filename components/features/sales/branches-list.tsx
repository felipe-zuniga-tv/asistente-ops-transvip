'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import type { Branch } from '@/types/domain/admin/types'
import type { Translation, Language } from '@/types/core/i18n'
import { Routes } from '@/utils/routes'

// Define the type for the branches part of the translation
type BranchesTranslation = Translation['branches']

interface BranchesListProps {
    branches: Branch[]
    t: BranchesTranslation // Expect only the branches translation
    language: Language
}

export function BranchesList({ branches, t, language }: BranchesListProps) {
    if (branches.length === 0) {
        return (
            <div className="text-center text-muted-foreground">
                No hay sucursales disponibles
            </div>
        )
    }

    return (
        <>
            { branches.map((branch) => (
                <Link key={branch.branch_id}
                    href={`${Routes.PUBLIC.VENTA_SUCURSALES}?branch=${branch.code.toLowerCase()}&lang=${language}`}
                    className="block transition-transform hover:scale-[1.02]"
                >
                    <Card className="h-full hover:bg-transvip/80 hover:text-white transition-colors">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold">{t.branchLocationPrefix} {branch.name}</CardTitle>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </>
    )
} 