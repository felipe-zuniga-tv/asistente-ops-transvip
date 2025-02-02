'use client'

import { useState, useCallback, useEffect } from "react"
import { startOfToday, addDays, format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { getVehicleShiftsByDateRange } from "@/lib/database/actions"
import type { VehicleShiftWithShiftInfo } from "@/lib/types"

interface ShiftSummary {
    date: string
    vehicles: {
        number: number
        shiftType: string
    }[]
}

export function VehicleShiftsSummary() {
    const [date, setDate] = useState<Date>(startOfToday())
    const [summaries, setSummaries] = useState<ShiftSummary[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const fetchShiftsSummary = useCallback(async () => {
        try {
            setIsLoading(true)
            const endDate = addDays(date, 30)
            const startDateStr = format(date, "yyyy-MM-dd")
            const endDateStr = format(endDate, "yyyy-MM-dd")

            const result = await getVehicleShiftsByDateRange(
                undefined,
                startDateStr,
                endDateStr
            )

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error
                })
                setSummaries([])
                return
            }

            // Group shifts by date
            const shiftsMap = new Map<string, VehicleShiftWithShiftInfo[]>()
            result.data?.forEach(shift => {
                const shiftDate = format(parseISO(shift.date), "yyyy-MM-dd")
                const existing = shiftsMap.get(shiftDate) || []
                shiftsMap.set(shiftDate, [...existing, shift])
            })

            // Create summaries
            const newSummaries: ShiftSummary[] = []
            shiftsMap.forEach((shifts, date) => {
                newSummaries.push({
                    date,
                    vehicles: shifts.map(shift => ({
                        number: shift.vehicleNumber,
                        shiftType: shift.shiftInfo.name
                    }))
                })
            })

            setSummaries(newSummaries.sort((a, b) => a.date.localeCompare(b.date)))
        } catch (error) {
            console.error("Error fetching shifts summary:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error al cargar el resumen de turnos"
            })
            setSummaries([])
        } finally {
            setIsLoading(false)
        }
    }, [date, toast])

    useEffect(() => {
        fetchShiftsSummary()
    }, [fetchShiftsSummary])

    return (
        <Card className="p-6">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => newDate && setDate(newDate)}
                        className="rounded-md border"
                        locale={es}
                    />
                    <Button 
                        onClick={fetchShiftsSummary}
                        disabled={isLoading}
                    >
                        {isLoading ? "Cargando..." : "Actualizar"}
                    </Button>
                </div>

                <div className="space-y-4">
                    {summaries.map((summary) => (
                        <Card key={summary.date} className="p-4">
                            <h3 className="text-lg font-semibold mb-2">
                                {format(parseISO(summary.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {summary.vehicles.map((vehicle, idx) => (
                                    <div 
                                        key={`${summary.date}-${vehicle.number}-${idx}`}
                                        className="flex items-center justify-between p-2 bg-muted rounded-lg"
                                    >
                                        <span>Vehículo {vehicle.number}</span>
                                        <span className="text-sm text-muted-foreground">{vehicle.shiftType}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}

                    {summaries.length === 0 && !isLoading && (
                        <div className="text-center text-muted-foreground py-8">
                            No hay turnos activos para mostrar en este período
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
} 