'use client'

import type { ColumnDef } from "@tanstack/react-table"
import { type PaymentMethod } from "@/types/domain/admin/types"
import { DataTable } from "@/components/ui/tables/data-table"

interface PaymentMethodDataTableProps {
    columns: ColumnDef<PaymentMethod>[]
    data: PaymentMethod[]
    onEdit?: (method: PaymentMethod) => void
    onDelete?: (method: PaymentMethod) => void
}

export function PaymentMethodDataTable({
    columns,
    data,
    onEdit,
    onDelete,
}: PaymentMethodDataTableProps) {
    return (
        <DataTable
            data={data}
            columns={columns}
            onEdit={onEdit}
            onDelete={onDelete}
            searchPlaceholder="Buscar método de pago..."
            searchColumnId="name"
            enableSearch={true}
        />
    )
} 