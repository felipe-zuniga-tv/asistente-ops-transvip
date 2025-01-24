import { Table } from "@tanstack/react-table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTableHeader<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    return (
        <>
            <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-gray-100">
                <div className="text-center text-sm text-muted-foreground">
                    Total: {table.getFilteredRowModel().rows.length} {table.getFilteredRowModel().rows.length === 1 ? "resultado" : "resultados"}
                </div>
                <div className="flex w-fit items-center justify-center text-sm font-normal text-muted-foreground">
                    Página {table.getState().pagination.pageIndex + 1} de{" "}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-normal text-muted-foreground">Filas por página</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px] bg-white">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="text-sm text-muted-foreground">
                Selección: {table.getFilteredSelectedRowModel().rows.length} de{" "}
                {table.getFilteredRowModel().rows.length} {table.getFilteredRowModel().rows.length === 1 ? "resultado" : "resultados"}
            </div>
        </>
    )
}