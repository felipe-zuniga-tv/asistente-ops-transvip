'use client'

import { useState } from 'react'
import { type Branch } from '@/lib/types/admin'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BranchConfigDataTable } from './table/branch-config-data-table'
import { BranchDialog } from './branch-dialog'
import { AlertDialogDeleteBranch } from './alert-dialog-delete-branch'
import { CardTitleContent } from '@/components/ui/card-title-content'
import { AddButton } from '@/components/ui/buttons'
import { ConfigCardContainer } from '@/components/tables/config-card-container'

interface BranchConfigProps {
    data: Branch[]
}

export function BranchConfig({ data }: BranchConfigProps) {
    const [branches, setBranches] = useState<Branch[]>(data)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null)
    const [branchToEdit, setBranchToEdit] = useState<Branch | null>(null)

    const handleEdit = (branch: Branch) => {
        setBranchToEdit(branch)
        setIsDialogOpen(true)
    }

    const handleDialogClose = (open: boolean) => {
        setIsDialogOpen(open)
        if (!open) {
            setBranchToEdit(null)
        }
    }

    const handleBranchCreate = (newBranch: Branch) => {
        setBranches(prevBranches => [...prevBranches, newBranch])
    }

    const handleBranchUpdate = (updatedBranch: Branch) => {
        setBranches(prevBranches =>
            prevBranches.map(branch =>
                branch.id === updatedBranch.id ? updatedBranch : branch
            )
        )
    }

    const handleBranchDelete = (deletedBranchId: number) => {
        setBranches(prevBranches =>
            prevBranches.filter(branch => String(branch.id) !== String(deletedBranchId))
        )
    }

    return (
        <ConfigCardContainer title="Sucursales"
            onAdd={() => setIsDialogOpen(true)}
        >
            <BranchConfigDataTable
                data={branches}
                onEdit={handleEdit}
                onDelete={setBranchToDelete}
            />

            <BranchDialog
                branch={branchToEdit}
                open={isDialogOpen}
                onOpenChange={handleDialogClose}
                onSuccess={branchToEdit ? handleBranchUpdate : handleBranchCreate}
            />

            <AlertDialogDeleteBranch
                branch={branchToDelete}
                onOpenChange={(open) => setBranchToDelete(open ? branchToDelete : null)}
                onSuccess={handleBranchDelete}
            />
        </ConfigCardContainer>
    )
} 