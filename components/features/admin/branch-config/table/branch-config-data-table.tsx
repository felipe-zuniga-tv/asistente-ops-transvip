'use client'

import { type Branch } from '@/lib/core/types/admin'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/tables/data-table'
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