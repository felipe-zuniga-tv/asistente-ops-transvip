"use client"

import { useState } from "react"
import { Upload, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { VehicleShiftsTable } from "./table/vehicle-shifts-table"
import { columns } from "./table/columns"
import { useRouter } from "next/navigation"
import { NewVehicleShiftDialog } from "./new-vehicle-shift-dialog"
import { EditVehicleShiftDialog } from "./edit-vehicle-shift-dialog"
import { UploadShiftsDialog } from "./upload-vehicle-shifts-dialog"
import { AlertDialogDeleteVehicleShift } from "./delete-vehicle-shift-alert-dialog"
import { generateVehicleShiftsTemplate } from "@/lib/csv/vehicle-shifts-template"
import { deleteVehicleShift } from "@/lib/shifts/actions"
import { useToast } from "@/hooks/use-toast"
import { AddButton } from "../ui/buttons"
import { CardTitleContent } from "../ui/card-title-content"

export interface VehicleShift {
    id: string
    vehicle_number: number
    shift_id: string
    shift_name: string
    start_date: string
    end_date: string
    priority: number
    created_at: string
    start_time?: string
    end_time?: string
}

interface VehicleShiftsContentProps {
    shifts: {
        id: string
        name: string
    }[]
    vehicleShifts: VehicleShift[]
}

export function VehicleShifts({ shifts, vehicleShifts }: VehicleShiftsContentProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [editingAssignment, setEditingAssignment] = useState<VehicleShift | null>(null)
    const [assignmentToDelete, setAssignmentToDelete] = useState<VehicleShift | null>(null)
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

    const handleDownloadTemplate = () => {
        const template = generateVehicleShiftsTemplate()
        const blob = new Blob([template], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "plantilla-asignaciones.csv"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    }

    const handleBulkDownload = (selectedShifts: VehicleShift[]) => {
        // Create CSV content
        const headers = ["Móvil", "Turno", "Fecha Inicio", "Fecha Fin", "Prioridad"]
        const rows = selectedShifts.map(shift => [
            shift.vehicle_number,
            shift.shift_name,
            shift.start_date,
            shift.end_date,
            shift.priority
        ])
        
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n")

        // Create and download the file
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "asignaciones-seleccionadas.csv"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    }

    const handleEditAssignment = (assignment: VehicleShift) => {
        setEditingAssignment({
            ...assignment,
            start_date: assignment.start_date,
            end_date: assignment.end_date,
        })
    }

    const handleEditComplete = async () => {
        try {
            setEditingAssignment(null)
            router.refresh()

            setTimeout(() => {
                window.location.reload()
            }, 100)
        } catch (error) {
            console.error('Error completing edit:', error)
        }
    }

    const handleBulkDelete = async (selectedShifts: VehicleShift[]) => {
        try {
            const results = await Promise.all(
                selectedShifts.map(shift => deleteVehicleShift(shift.id))
            )
            
            const errors = results.filter(result => result.error)
            if (errors.length > 0) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: `Error al eliminar ${errors.length} asignaciones`
                })
            } else {
                toast({
                    title: "Éxito",
                    description: `${results.length} asignaciones eliminadas correctamente`
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
        <Card className="max-w-4xl lg:mx-auto">
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                    <CardTitleContent title="Asignación de Vehículos" />
                    <AddButton
                        text="Añadir"
                        className="text-xs md:text-sm"
                        onClick={() => setIsNewDialogOpen(true)}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
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
            </CardContent>

            <NewVehicleShiftDialog
                open={isNewDialogOpen}
                onOpenChange={setIsNewDialogOpen}
                shifts={shifts}
            />

            <EditVehicleShiftDialog
                open={!!editingAssignment}
                onOpenChange={handleEditComplete}
                assignment={editingAssignment}
                shifts={shifts}
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
        </Card>
    )
}
