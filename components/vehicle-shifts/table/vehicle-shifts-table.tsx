"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Search, Trash2 } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { VehicleShift } from "../vehicle-shifts"
import { DataTableHeader } from "@/components/tables/data-table-header"
import { DataTablePagination } from "@/components/tables/data-table-pagination"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface DataTableProps {
    columns: ColumnDef<VehicleShift>[]
    data: VehicleShift[]
    onEdit?: (shift: VehicleShift) => void
    onDelete?: (shift: VehicleShift) => void
    onBulkDelete?: (shifts: VehicleShift[]) => void
}

export function VehicleShiftsTable({
    columns,
    data,
    onEdit,
    onDelete,
    onBulkDelete,
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
            <div className="flex items-center justify-between gap-4">
                <div className="relative">
                    <Input
                        placeholder="Filtrar por móvil..."
                        value={table.getColumn("vehicle_number")?.getFilterValue() as number ?? ""}
                        onChange={(event) => {
                            table.getColumn("vehicle_number")?.setFilterValue(event.target.value)
                        }}
                        className="peer pe-9 ps-9 max-w-xs"
                    />
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                        <Search size={16} strokeWidth={2} />
                    </div>
                </div>

                {/* Show bulk action button when rows are selected */}
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <Trash2 className="h-4 w-4" />
                        Eliminar seleccionados
                    </Button>

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
            </div>
            <DataTableHeader table={table} />
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-gray-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </>
    )
}
