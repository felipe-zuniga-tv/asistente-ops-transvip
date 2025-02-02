'use client'

import { useState, useCallback, useEffect, useMemo } from "react"
import { startOfToday, addDays, format, parseISO, getDay } from "date-fns"
import { es } from "date-fns/locale"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { getVehicleShiftsByDateRange } from "@/lib/database/actions"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, X } from "lucide-react"
import type { VehicleShiftWithShiftInfo } from "@/lib/types"

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

// Helper function to adjust day index to start from Monday
function adjustDayIndex(date: Date): number {
    const day = getDay(date)
    return day === 0 ? 6 : day - 1 // Convert Sunday (0) to 6, and shift other days back by 1
}

interface ShiftSummary {
    date: string
    vehicles: {
        number: number
        shiftType: string
        startTime?: string
        endTime?: string
    }[]
}

export function VehicleShiftsSummary() {
    const [date, setDate] = useState<Date>(startOfToday())
    const [summaries, setSummaries] = useState<ShiftSummary[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchShiftsSummary = useCallback(async () => {
        try {
            setIsLoading(true)
            const endDate = addDays(date, 30)
            const startDateStr = format(date, "yyyy-MM-dd")
            const endDateStr = format(endDate, "yyyy-MM-dd")

            const result = await getVehicleShiftsByDateRange(
                0,
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

            // Create a map for all dates in our range
            const shiftsMap = new Map<string, VehicleShiftWithShiftInfo[]>()
            let currentDate = date
            while (currentDate <= endDate) {
                shiftsMap.set(format(currentDate, "yyyy-MM-dd"), [])
                currentDate = addDays(currentDate, 1)
            }

            // Add shifts to their corresponding dates
            result.data?.forEach(shift => {
                const shiftStart = parseISO(shift.start_date)
                const shiftEnd = parseISO(shift.end_date)
                
                let currentDate = shiftStart
                while (currentDate <= shiftEnd) {
                    const dateStr = format(currentDate, "yyyy-MM-dd")
                    if (shiftsMap.has(dateStr)) {
                        const existing = shiftsMap.get(dateStr) || []
                        shiftsMap.set(dateStr, [...existing, shift])
                    }
                    currentDate = addDays(currentDate, 1)
                }
            })

            // Create summaries
            const newSummaries: ShiftSummary[] = Array.from(shiftsMap.entries()).map(([date, shifts]) => ({
                date,
                vehicles: shifts
                    .filter(shift => !shift.free_day && !shift.isStatus)
                    .map(shift => ({
                        number: shift.vehicle_number,
                        shiftType: shift.shift_name,
                        startTime: shift.start_time,
                        endTime: shift.end_time
                    }))
            }))

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

    const selectedDateSummary = useMemo(() => {
        if (!selectedDate) return null
        return summaries.find(s => s.date === selectedDate)
    }, [selectedDate, summaries])

    const nextDays = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => addDays(date, i))
    }, [date])

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex flex-col space-y-1.5">
                        <h2 className="font-semibold text-lg">Resumen de Turnos por Fecha</h2>
                        <p className="text-sm text-muted-foreground">
                            Seleccione una fecha para ver los vehículos con turnos activos en los próximos 30 días
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(newDate) => newDate && setDate(newDate)}
                                    initialFocus
                                    locale={es}
                                />
                            </PopoverContent>
                        </Popover>
                        <Button 
                            onClick={fetchShiftsSummary}
                            disabled={isLoading}
                        >
                            {isLoading ? "Cargando..." : "Actualizar"}
                        </Button>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <div className="grid grid-cols-7 gap-1.5">
                    {weekDays.map((day) => (
                        <div key={day} className="text-center font-semibold p-1 text-sm bg-muted shadow">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1.5 mt-1.5">
                    {/* Add empty cells for first week alignment */}
                    {Array.from({ length: adjustDayIndex(date) }, (_, i) => (
                        <div key={`empty-start-${i}`} className="p-1 border-0 rounded-sm min-h-[4rem] bg-transparent" />
                    ))}

                    {nextDays.map((day, index) => {
                        const dateStr = format(day, "yyyy-MM-dd")
                        const summary = summaries.find(s => s.date === dateStr)
                        const vehicleCount = summary?.vehicles.length || 0
                        const isSelected = selectedDate === dateStr

                        return (
                            <button
                                key={dateStr}
                                type="button"
                                className={cn(
                                    "p-2 border rounded-sm min-h-[4rem] text-left transition-colors",
                                    isSelected ? "ring-2 ring-primary" : "",
                                    vehicleCount > 0 ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-muted/50"
                                )}
                                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                            >
                                <div className="text-xs font-medium">
                                    {format(day, "d", { locale: es })}
                                </div>
                                {vehicleCount > 0 && (
                                    <div className="mt-1 text-xs text-blue-600 font-medium">
                                        {vehicleCount} vehículo{vehicleCount !== 1 ? 's' : ''}
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            </Card>

            {selectedDate && (
                <Card className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                {format(parseISO(selectedDate), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedDate(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                            {selectedDateSummary?.vehicles.map((vehicle, idx) => (
                                <div 
                                    key={`${selectedDate}-${vehicle.number}-${idx}`}
                                    className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                                >
                                    <span className="font-medium">{vehicle.number}</span>
                                    <div className="text-sm">
                                        <span className="font-medium text-primary">{vehicle.shiftType}</span>
                                        {vehicle.startTime && vehicle.endTime && (
                                            <span className="ml-2 text-muted-foreground">
                                                {vehicle.startTime} - {vehicle.endTime}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {(!selectedDateSummary?.vehicles.length) && (
                                <div className="text-center text-muted-foreground py-8 md:col-span-2 lg:col-span-3">
                                    No hay vehículos con turnos activos en esta fecha
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
} 