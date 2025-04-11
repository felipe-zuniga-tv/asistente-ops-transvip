"use client";

import { DataTable } from "@/components/ui/tables/data-table";
import { columns } from "./columns";
import type { OperationsFormQuestion } from "@/lib/core/types/vehicle/forms";

interface OperationsFormQuestionsDataTableProps {
    data: OperationsFormQuestion[];
    onEdit: (question: OperationsFormQuestion) => void;
    onDelete: (question: OperationsFormQuestion) => void;
}

export function OperationsFormQuestionsDataTable({
    data,
    onEdit,
    onDelete,
}: OperationsFormQuestionsDataTableProps) {
    return (
        <DataTable
            data={data}
            columns={columns({ onEdit, onDelete })}
            searchPlaceholder="Buscar pregunta..."
            searchColumnId="label"
            enableSearch
            initialPageSize={10}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
} 