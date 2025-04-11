'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import type { Branch } from '@/lib/core/types/admin'
import type { Language } from '@/lib/core/i18n'
import { Routes } from '@/utils/routes'

interface BranchesListProps {
    branches: Branch[]
    language: Language
}

export function BranchesList({ branches, language }: BranchesListProps) {
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
                            <CardTitle className="text-2xl font-bold">{branch.name}</CardTitle>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </>
    )
} 