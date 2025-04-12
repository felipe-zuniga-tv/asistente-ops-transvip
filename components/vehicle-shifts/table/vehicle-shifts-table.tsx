"use client"

import { useState, useMemo, useCallback } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Download, Trash2 } from "lucide-react"
import type { VehicleShift } from "@/components/features/vehicles/vehicle-shifts"
import { DataTable } from "@/components/ui/tables/data-table"
import {
    Button,
    SimpleDialog,
    SimpleDialogDescription,
    SimpleDialogFooter,
    SimpleDialogHeader,
    SimpleDialogTitle,
} from "@/components/ui"

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

    const handleSelectionChange = useCallback((rows: VehicleShift[]) => {
        setSelectedRows(rows)
    }, [])

    const handleBulkDelete = useCallback(() => {
        if (selectedRows.length > 0) {
            onBulkDelete?.(selectedRows)
            setIsDeleteDialogOpen(false)
            setSelectedRows([])
        }
    }, [selectedRows, onBulkDelete])

    const handleBulkDownload = useCallback(() => {
        if (selectedRows.length > 0) {
            onBulkDownload?.(selectedRows)
        }
    }, [selectedRows, onBulkDownload])

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
                        <span className="text-sm font-semibold">
                            Seleccionados: {selectedRows.length}
                        </span>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="shadow"
                            onClick={handleBulkDownload}
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
            <SimpleDialog 
                isOpen={isDeleteDialogOpen} 
                onClose={() => setIsDeleteDialogOpen(false)}
            >
                <SimpleDialogHeader>
                    <SimpleDialogTitle>Confirmar eliminación</SimpleDialogTitle>
                    <SimpleDialogDescription className="pt-4">
                        <div className="flex flex-col gap-2">
                            <p>¿Estás seguro que deseas eliminar los {selectedRows.length} turnos seleccionados?</p>
                            <p>Esta acción <b>no</b> se puede deshacer.</p>
                        </div>
                    </SimpleDialogDescription>
                </SimpleDialogHeader>
                <SimpleDialogFooter>
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
                </SimpleDialogFooter>
            </SimpleDialog>
        </>
    )
}
