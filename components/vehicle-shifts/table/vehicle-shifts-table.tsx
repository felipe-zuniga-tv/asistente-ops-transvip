"use client"

import { useState, useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"
import type { VehicleShift } from "../vehicle-shifts"
import { DataTable } from "@/components/tables/data-table"
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
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState<VehicleShift[]>([])

    // Get unique branch options from data
    const branchOptions = useMemo(() => 
        Array.from(new Set(data.map(shift => shift.branch_name))).map(name => ({
            label: name,
            value: name
        }))
    , [data])

    const handleSelectionChange = (rows: VehicleShift[]) => {
        setSelectedRows(rows)
    }

    const handleBulkDelete = () => {
        onBulkDelete?.(selectedRows)
        setIsDeleteDialogOpen(false)
    }

    return (
        <>
            <DataTable
                data={data}
                columns={columns}
                onEdit={onEdit}
                onDelete={onDelete}
                enableRowSelection={true}
                onSelectionChange={handleSelectionChange}
                filterOptions={[
                    {
                        columnId: "branch_name",
                        options: branchOptions,
                        placeholder: "Filtrar por sucursal..."
                    }
                ]}
                searchColumnId="shift_name"
                searchPlaceholder="Filtrar por turno..."
            >
                {selectedRows.length > 0 && (
                    <div className="w-full flex items-center justify-end gap-2">
                        <span className="text-sm font-semibold">Seleccionados:</span>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="shadow"
                            onClick={() => onBulkDownload?.(selectedRows)}
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
            </DataTable>

            {/* Delete confirmation dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogDescription className="pt-4">
                            <div className="flex flex-col gap-2">
                                <p>¿Estás seguro que deseas eliminar los {selectedRows.length} turnos seleccionados?</p>
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
        </>
    )
}
