import { Table } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-end space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <ArrowLeft className="h-4 w-4" /> Anterior
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Siguiente <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
    )
}