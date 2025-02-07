'use client'

import type { ColumnDef } from "@tanstack/react-table"
import type { PaymentMethod } from '@/lib/types/admin'
import { DataTable } from "@/components/tables/data-table"

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