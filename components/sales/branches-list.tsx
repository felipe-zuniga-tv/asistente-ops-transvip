'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import type { Branch } from '@/lib/types/admin'
import type { Language } from '@/lib/translations'
import { Routes } from '@/utils/routes'

interface BranchesListProps {
    branches: Branch[]
    language: Language
}

export function BranchesList({ branches, language }: BranchesListProps) {
    return (
        <>
            {branches.map((branch) => (
                <Link
                    key={branch.branch_id}
                    href={`${Routes.PUBLIC.VENTA_SUCURSALES}?branch=${branch.code.toLowerCase()}&lang=${language}`}
                    className="block transition-transform hover:scale-[1.02]"
                >
                    <Card className="h-full hover:bg-accent/50 transition-colors">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold">{branch.name}</CardTitle>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </>
    )
} 