"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { SalesResponse } from "@/lib/types/sales"

interface SalesResponseNotesDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    response: SalesResponse | null
    onSave: (id: string, notes: string) => Promise<void>
}

export function SalesResponseNotesDialog({
    open,
    onOpenChange,
    response,
    onSave,
}: SalesResponseNotesDialogProps) {
    const [notes, setNotes] = React.useState("")
    const [isSaving, setIsSaving] = React.useState(false)

    React.useEffect(() => {
        if (response) {
            setNotes(response.notes || "")
        }
    }, [response])

    const handleSave = async () => {
        if (!response) return

        try {
            setIsSaving(true)
            await onSave(response.id, notes)
            onOpenChange(false)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Notas</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-1.5">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right font-semibold">Sucursal</Label>
                            <div className="col-span-3 text-sm">
                                {response?.branch_name}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right font-semibold">Nombre</Label>
                            <div className="col-span-3 text-sm">
                                {response?.first_name} {response?.last_name}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right font-semibold">Teléfono</Label>
                            <div className="col-span-3 text-sm">
                                {response?.phone_number}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right font-semibold">Email</Label>
                            <div className="col-span-3 text-sm">
                                {response?.email}
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notas</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ingrese notas adicionales aquí..."
                            className="h-32"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Guardando..." : "Guardar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 