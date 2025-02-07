'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { type Branch } from '@/lib/types/admin'
import { BranchConfigDataTable } from './table/branch-config-data-table'
import { BranchDialog } from './branch-dialog'
import { AlertDialogDeleteBranch } from './alert-dialog-delete-branch'
import { ConfigCardContainer } from '@/components/tables/config-card-container'

interface BranchConfigProps {
    data: Branch[]
}

export function BranchConfig({ data }: BranchConfigProps) {
    const [branches, setBranches] = useState<Branch[]>(data)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null)
    const [branchToEdit, setBranchToEdit] = useState<Branch | null>(null)

    const handleEdit = useCallback((branch: Branch) => {
        setBranchToEdit(branch)
        setIsDialogOpen(true)
    }, [])

    const handleDialogClose = useCallback((open: boolean) => {
        setIsDialogOpen(open)
        if (!open) {
            setBranchToEdit(null)
        }
    }, [])

    const handleBranchCreate = useCallback((newBranch: Branch) => {
        setBranches(prevBranches => [...prevBranches, newBranch])
    }, [])

    const handleBranchUpdate = useCallback((updatedBranch: Branch) => {
        setBranches(prevBranches =>
            prevBranches.map(branch =>
                branch.id === updatedBranch.id ? updatedBranch : branch
            )
        )
    }, [])

    const handleBranchDelete = useCallback((deletedBranchId: string) => {
        setBranches(prevBranches =>
            prevBranches.filter(branch => String(branch.id) !== String(deletedBranchId))
        )
    }, [])

    // Memoize the dialog component to prevent unnecessary re-renders
    const branchDialog = useMemo(() => (
        <BranchDialog
            branch={branchToEdit}
            open={isDialogOpen}
            onOpenChange={handleDialogClose}
            onSuccess={branchToEdit ? handleBranchUpdate : handleBranchCreate}
        />
    ), [branchToEdit, isDialogOpen, handleDialogClose, handleBranchUpdate, handleBranchCreate])

    // Memoize the delete dialog to prevent unnecessary re-renders
    const deleteDialog = useMemo(() => (
        <AlertDialogDeleteBranch
            branch={branchToDelete}
            onOpenChange={(open) => setBranchToDelete(open ? branchToDelete : null)}
            onSuccess={handleBranchDelete}
        />
    ), [branchToDelete, handleBranchDelete])

    return (
        <ConfigCardContainer title="Sucursales"
            onAdd={() => setIsDialogOpen(true)}
            className="max-w-full"
        >
            <BranchConfigDataTable
                data={branches}
                onEdit={handleEdit}
                onDelete={setBranchToDelete}
            />
            {branchDialog}
            {deleteDialog}
        </ConfigCardContainer>
    )
} 