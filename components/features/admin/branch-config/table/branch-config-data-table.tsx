'use client'

import { type Branch } from "@/types/domain/admin/types"
import { DataTable } from '@/components/ui/tables/data-table'
import { columns } from './columns'

interface BranchConfigDataTableProps {
    data: Branch[]
    onEdit: (branch: Branch) => void
    onDelete: (branch: Branch) => void
}

export function BranchConfigDataTable({
    data,
    onEdit,
    onDelete,
}: BranchConfigDataTableProps) {
    return (
        <DataTable
            data={data}
            columns={columns}
            searchPlaceholder="Buscar sucursal..."
            searchColumnId="name"
            onEdit={onEdit}
            onDelete={onDelete}
            initialPageSize={10}
        />
    )
} 