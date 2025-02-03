"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"
import { useState } from "react"
import { VehicleShift } from "../vehicle-shifts"
import { DataTableHeader } from "@/components/tables/data-table-header"
import { DataTablePagination } from "@/components/tables/data-table-pagination"
import { DataTableContent } from "@/components/tables/data-table-content"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DataTableSearch } from "@/components/tables/data-table-search"

interface DataTableProps {
    columns: ColumnDef<VehicleShift>[]
    data: VehicleShift[]
    onEdit?: (shift: VehicleShift) => void
    onDelete?: (shift: VehicleShift) => void
    onBulkDelete?: (shifts: VehicleShift[]) => void
    onBulkDownload?: (shifts: VehicleShift[]) => void
}

export function VehicleShiftsTable({
    columns,
    data,
    onEdit,
    onDelete,
    onBulkDelete,
    onBulkDownload,
}: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState<string>("")
    const [rowSelection, setRowSelection] = useState({})
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            rowSelection,
        },
        filterFns: {
            fuzzy: (row, columnId, value) => {
                const rowValue = String(row.getValue(columnId))
                return rowValue.toLowerCase().includes(String(value).toLowerCase())
            },
        },
        meta: {
            onEdit,
            onDelete,
        },
    })

    // Get selected rows data
    const getSelectedRows = () => {
        return table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)
    }

    const handleBulkDelete = () => {
        const selectedShifts = getSelectedRows()
        onBulkDelete?.(selectedShifts)
        setIsDeleteDialogOpen(false)
        setRowSelection({})
    }

    return (
        <>
            <div className="flex items-center justify-start gap-4 py-1">
                <DataTableSearch
                    table={table}
                    placeholder="Filtrar por móvil..."
                    searchColumnId="vehicle_number"
                />
                <DataTableSearch
                    table={table}
                    placeholder="Filtrar por turno..."
                    searchColumnId="shift_name"
                />
            </div>

            {/* Show bulk action buttons when rows are selected */}
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <div className="w-full flex items-center justify-end gap-2">
                    <span className="text-sm font-semibold">Seleccionados:</span>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="shadow"
                        onClick={() => onBulkDownload?.(getSelectedRows())}
                    >
                        <Download className="h-4 w-4" />
                        Descargar
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="shadow"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                    </Button>
                </div>
            )}

            {/* Delete confirmation dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogDescription className="pt-4">
                            <div className="flex flex-col gap-2">
                                <p>¿Estás seguro que deseas eliminar los {table.getFilteredSelectedRowModel().rows.length} turnos seleccionados?</p>
                                <p>Esta acción <b>no</b> se puede deshacer.</p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBulkDelete}
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        
            <DataTableHeader table={table} />
            <DataTableContent table={table} columns={columns.length} />
            <DataTablePagination table={table} />
        </>
    )
}
