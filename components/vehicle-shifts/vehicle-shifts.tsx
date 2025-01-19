"use client"

import { useState } from "react"
import { PlusCircle, Upload, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransvipLogo } from "../transvip/transvip-logo"
import { VehicleShiftsTable } from "./table/vehicle-shifts-table"
import { columns } from "./table/columns"
import { useRouter } from "next/navigation"
import { NewVehicleShiftDialog } from "./new-vehicle-shift-dialog"
import { EditVehicleShiftDialog } from "./edit-vehicle-shift-dialog"
import { UploadShiftsDialog } from "./upload-vehicle-shifts-dialog"
import { AlertDialogDeleteVehicleShift } from "./delete-vehicle-shift-alert-dialog"
import { generateVehicleShiftsTemplate } from "@/lib/csv/vehicle-shifts-template"

export interface VehicleShift {
    id: string
    vehicle_number: number
    shift_id: string
    shift_name: string
    start_date: string
    end_date: string
    priority: number
    created_at: string
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
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [editingAssignment, setEditingAssignment] = useState<VehicleShift | null>(null)
    const [assignmentToDelete, setAssignmentToDelete] = useState<VehicleShift | null>(null)

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

    return (
        <Card className="max-w-4xl lg:mx-auto">
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2">
                        <TransvipLogo size={20} />
                        <span className="text-sm sm:text-base">Asignación de Vehículos</span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="default"
                            className="text-xs md:text-sm"
                            onClick={handleDownloadTemplate}
                        >
                            <Download className="w-4 h-4" />
                            Plantilla CSV
                        </Button>
                        <Button
                            variant="outline"
                            size="default"
                            className="text-xs md:text-sm"
                            onClick={() => setIsUploadDialogOpen(true)}
                        >
                            <Upload className="w-4 h-4" />
                            Carga Masiva
                        </Button>
                        <Button 
                            size="default"
                            className="text-xs md:text-sm"
                            onClick={() => setIsNewDialogOpen(true)}
                        >
                            <PlusCircle className="w-4 h-4" />
                            Añadir
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <VehicleShiftsTable
                    columns={columns}
                    data={vehicleShifts}
                    onEdit={handleEditAssignment}
                    onDelete={setAssignmentToDelete}
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
