"use client"

import { useEffect, useState } from "react"
import { Upload, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { VehicleShiftsTable } from "./table/vehicle-shifts-table"
import { columns } from "./table/columns"
import { useRouter } from "next/navigation"
import { VehicleShiftDialog } from "./vehicle-shift-dialog"
import { UploadShiftsDialog } from "./upload-vehicle-shifts-dialog"
import { AlertDialogDeleteVehicleShift } from "./delete-vehicle-shift-alert-dialog"
import { generateVehicleShiftsTemplate } from "@/lib/features/csv/vehicle-shifts-template"
import { deleteVehicleShift, bulkDeleteVehicleShifts } from "@/lib/features/shifts/actions"
import { useToast } from "@/hooks/use-toast"
import { ConfigCardContainer } from "../tables/config-card-container"
import { downloadFile } from "@/lib/utils/file"

export interface VehicleShift {
    id: string
    vehicle_number: number
    shift_id: string
    shift_name: string
    branch_id: string
    start_date: string
    end_date: string
    priority: number
    created_at: string
    start_time?: string
    end_time?: string
    branch_name: string
}

interface VehicleShiftsContentProps {
    shifts: {
        id: string
        name: string
        branch_id: string
    }[]
    vehicleShifts: VehicleShift[]
}

export function VehicleShifts({ shifts, vehicleShifts }: VehicleShiftsContentProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [editingAssignment, setEditingAssignment] = useState<VehicleShift | null>(null)
    const [assignmentToDelete, setAssignmentToDelete] = useState<VehicleShift | null>(null)
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

    useEffect(() => {
        if (!isDialogOpen || !editingAssignment) {
            // Pushing the change to the end of the call stack
            const timer = setTimeout(() => {
              document.body.style.pointerEvents = "";
            }, 0);
      
            return () => clearTimeout(timer);
          } else {
            document.body.style.pointerEvents = "auto";
          }
    }), [isDialogOpen, editingAssignment]

    const handleDownloadTemplate = async () => {
        const template = generateVehicleShiftsTemplate()
        await downloadFile(template, "plantilla-asignaciones.csv", {
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se pudo descargar el archivo"
                })
            }
        })
    }

    const handleBulkDownload = async (selectedShifts: VehicleShift[]) => {
        const headers = ["Móvil", "Sucursal", "Turno", "Fecha Inicio", "Fecha Fin", "Prioridad"]
        const rows = selectedShifts.map(shift => [
            shift.vehicle_number,
            shift.branch_name,
            shift.shift_name,
            shift.start_date,
            shift.end_date,
            shift.priority
        ])

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n")

        await downloadFile(csvContent, "asignaciones-seleccionadas.csv", {
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se pudo descargar el archivo"
                })
            }
        })
    }

    const handleEditAssignment = (assignment: VehicleShift) => {
        setEditingAssignment({
            ...assignment,
            start_date: assignment.start_date,
            end_date: assignment.end_date,
        })
        setIsDialogOpen(true)
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false)
        setEditingAssignment(null)
        router.refresh()
    }

    const handleBulkDelete = async (selectedShifts: VehicleShift[]) => {
        try {
            const { error } = await bulkDeleteVehicleShifts(selectedShifts.map(shift => shift.id))

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error
                })
            } else {
                toast({
                    title: "Éxito",
                    description: `${selectedShifts.length} asignaciones eliminadas correctamente`
                })
            }

            router.refresh()
        } catch (error) {
            console.error('Error deleting shifts:', error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error al eliminar las asignaciones"
            })
        }
    }

    return (
        <ConfigCardContainer title="Asignación de Vehículos"
            onAdd={() => setIsDialogOpen(true)}
            className="max-w-full"
            >
            <div className="flex items-center space-x-2">
                <Switch
                    id="advanced-options"
                    checked={showAdvancedOptions}
                    onCheckedChange={setShowAdvancedOptions}
                />
                <Label htmlFor="advanced-options">Opciones Avanzadas</Label>
            </div>

            {showAdvancedOptions && (
                <div className="flex gap-2 bg-gray-200 p-2 rounded-md">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadTemplate}
                    >
                        <Download className="w-4 h-4" />
                        Plantilla CSV
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsUploadDialogOpen(true)}
                    >
                        <Upload className="w-4 h-4" />
                        Carga Masiva
                    </Button>
                </div>
            )}

            <VehicleShiftsTable
                columns={columns}
                data={vehicleShifts}
                onEdit={handleEditAssignment}
                onDelete={setAssignmentToDelete}
                onBulkDelete={handleBulkDelete}
                onBulkDownload={handleBulkDownload}
            />

            <VehicleShiftDialog
                open={isDialogOpen}
                onOpenChange={handleDialogClose}
                shifts={shifts}
                assignment={editingAssignment}
            />

            <UploadShiftsDialog
                open={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
                shifts={shifts}
            />

            <AlertDialogDeleteVehicleShift
                assignment={assignmentToDelete}
                onOpenChange={(open) => setAssignmentToDelete(open ? assignmentToDelete : null)}
            />
        </ConfigCardContainer>
    )
}