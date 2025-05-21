'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { startOfToday, format, parseISO, isWithinInterval, setHours, setMinutes, setSeconds, setMilliseconds, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { X, Download } from "lucide-react"
import { toPng } from "html-to-image"
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/utils/ui'
import { TransvipLogo } from "@/components/features/transvip/transvip-logo"
import { generateNextXDays, generateCalendarMonths } from "@/utils/date"
import type { Branch } from "@/lib/core/types/admin"
import { useVehicleCalendarData, type CalendarDaySummary, type VehicleCalendarEntry } from "@/hooks/features/vehicles/use-vehicle-calendar-data"

// UI Components
import { Badge, Button, CalendarGrid, Card, CardHeader, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"

interface ShiftOption {
    value: string
    label: string
}

export function VehicleShiftsSummary({ branches }: { branches: Branch[] }) {
    const today = useMemo(() => startOfToday(), []);
    const [daysToShow, setDaysToShow] = useState<number>(0); // Default to 0 days, user must select
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedBranch, setSelectedBranch] = useState<string>("")
    const { toast } = useToast()
    const summaryRef = useRef<HTMLDivElement>(null)

    const {
        calendarDaysData,
        isLoading, // Main loading state from the new hook
        error,
        refetchData, // Renamed from refetchSummaries
        // isLoadingOnlineStatus, // Can be used if specific UI for this is needed
        // onlineStatusError, // Can be used for specific error handling
    } = useVehicleCalendarData({
        currentDate: today,
        daysToShow,
        branchId: selectedBranch === "all" ? undefined : selectedBranch
    })

    useEffect(() => {
        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error,
            })
        }
    }, [error, toast])

    const selectedDateSummary = useMemo(() => {
        if (!selectedDate) return null
        // Find from calendarDaysData
        return calendarDaysData.find((s: CalendarDaySummary) => s.date === selectedDate)
    }, [selectedDate, calendarDaysData])

    const nextDays = useMemo(() => generateNextXDays(daysToShow, today), [daysToShow, today])
    const months = useMemo(() => generateCalendarMonths(nextDays), [nextDays])

    const renderCell = useCallback((dateToRender: Date) => {
        const dateStr = format(dateToRender, "yyyy-MM-dd")
        const summary: CalendarDaySummary | undefined = calendarDaysData.find((s: CalendarDaySummary) => s.date === dateStr)
        const vehicleCount = summary?.vehicles.length || 0
        const isSelected = selectedDate === dateStr

        let cellBgColor = "hover:bg-muted/50"
        let statusText = "Sin turnos"
        let statusTextColor = "text-slate-500" // More neutral for "no shifts"
        let dayNumberTextColor = "text-slate-700" // Default dark color for day numbers

        if (vehicleCount > 0) {
            statusText = `${vehicleCount} móvil${vehicleCount !== 1 ? 'es' : ''}`
            cellBgColor = "bg-sky-50 hover:bg-sky-100" // Using sky for a neutral, informative color
            statusTextColor = "text-sky-700"
            // dayNumberTextColor remains default dark
        }
        // If vehicleCount is 0, the default values for "Sin turnos" are used.

        return (
            <div
                key={dateStr}
                className={cn(
                    "p-1 border rounded-sm min-h-[3.5rem] text-left hover:cursor-pointer hover:border-muted-foreground",
                    isSelected ? "ring-2 ring-primary" : "",
                    cellBgColor
                )}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
            >
                <div className={cn("text-xs font-medium", dayNumberTextColor)}>
                    {format(dateToRender, "d", { locale: es })}
                </div>
                <div className={cn("text-xs font-medium text-center pt-1.5", statusTextColor)}>
                    {statusText}
                </div>
            </div>
        )
    }, [selectedDate, calendarDaysData])
                                  
    const handleScreenshot = async () => {
        if (!summaryRef.current || !selectedDate) return

        try {
            const dataUrl = await toPng(summaryRef.current, {
                quality: 1.0,
                backgroundColor: 'white',
            })

            const link = document.createElement('a')
            link.download = `turnos-${format(parseISO(selectedDate), 'yyyy-MM-dd')}.png`
            link.href = dataUrl
            link.click()

            toast({
                title: "Éxito",
                description: "Resumen guardado como imagen",
            })
        } catch (err) {
            console.error('Error al generar la imagen:', err)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo generar la imagen del resumen",
            })
        }
    }

    const groupedVehicles = useMemo(() => {
        if (!selectedDateSummary || !selectedDate) return []

        const now = new Date()
        const selectedDayBase = parseISO(selectedDate)

        const filteredVehicles = selectedDateSummary.vehicles.filter((vehicle: VehicleCalendarEntry) => {
            if (vehicle.statusInfo) {
                return true // Always include vehicles with statusInfo
            }

            // For vehicles without statusInfo, check if their shift is active now
            if (vehicle.startTime && vehicle.endTime) {
                try {
                    const [startHour, startMinute] = vehicle.startTime.split(':').map(Number)
                    const [endHour, endMinute] = vehicle.endTime.split(':').map(Number)

                    const shiftStartDateTime = setMilliseconds(setSeconds(setMinutes(setHours(selectedDayBase, startHour), startMinute), 0), 0)
                    let shiftEndDateTime = setMilliseconds(setSeconds(setMinutes(setHours(selectedDayBase, endHour), endMinute), 0), 0)
                    
                    if (shiftEndDateTime < shiftStartDateTime) {
                        shiftEndDateTime = addDays(shiftEndDateTime, 1)
                    }

                    return isWithinInterval(now, { start: shiftStartDateTime, end: shiftEndDateTime })
                } catch (e) {
                    console.warn("Error parsing shift times for vehicle:", vehicle.number, e)
                    return false // If times are malformed, exclude
                }
            }
            return false // Exclude if no statusInfo and no valid shift times
        })

        const groups = new Map<string, VehicleCalendarEntry[]>()

        filteredVehicles.forEach((vehicle: VehicleCalendarEntry) => {
            // Group by statusInfo first if it exists
            if (vehicle.statusInfo) {
                const statusKey = `${vehicle.statusInfo.label}`
                if (!groups.has(statusKey)) {
                    groups.set(statusKey, [])
                }
                groups.get(statusKey)?.push(vehicle)
            } else {
                // If no statusInfo, group by shift for the selected date
                // No need to check if the shift is "active now", just that it's scheduled for the selectedDate
                const shiftKey = vehicle.shiftName 
                    ? `${vehicle.shiftName} (${vehicle.startTime} - ${vehicle.endTime})` 
                    : "Turno no especificado"
                
                if (!groups.has(shiftKey)) {
                    groups.set(shiftKey, [])
                }
                groups.get(shiftKey)?.push(vehicle)
            }
        })

        return Array.from(groups.entries()).map(([key, vehicles]) => ({
            shiftKey: key,
            vehicles: vehicles.sort((a, b) => a.number - b.number)
        }))
    }, [selectedDateSummary, selectedDate])

    console.log(groupedVehicles)

    return (
        <div className="space-y-2 max-w-full">
            <Card className="p-0">
                <CardHeader className="gap-2 space-y-0">
                    <div className="flex gap-2 items-center">
                        <TransvipLogo size={20} />
                        <h2 className="font-semibold text-lg">Resumen de Turnos por Fecha</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Para visualizar el resumen, seleccione una sucursal, el número de días y presione Buscar. El calendario comenzará desde hoy.
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex items-center gap-4">
                            <Label className="text-sm text-muted-foreground">Sucursal</Label>
                            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Seleccionar sucursal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    {branches.map((branch) => (
                                        <SelectItem key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="days-to-show" className="text-sm text-muted-foreground">Ver próximos</Label>
                            <Select
                                value={String(daysToShow)}
                                onValueChange={(value) => setDaysToShow(Number(value))}
                            >
                                <SelectTrigger className="w-[120px]" id="days-to-show">
                                    <SelectValue placeholder="Días" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 3, 7, 15, 30].map(d => (
                                        <SelectItem key={d} value={String(d)}>
                                            {d} día{d > 1 ? 's' : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={refetchData} // Use refetchData from the new hook
                            disabled={isLoading || !selectedBranch || daysToShow === 0}
                            className="bg-transvip text-white hover:bg-transvip/90"
                        >
                            {isLoading ? "Cargando..." : "Buscar"}
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {calendarDaysData.length > 0 && (
                <Card className="p-6">
                    <CalendarGrid months={months} renderCell={renderCell} />
                </Card>
            )}

            {selectedDate && selectedDateSummary && (
                <Card ref={summaryRef} className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold">
                                {format(parseISO(selectedDate), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                            </h3>
                            <div className="text-xs text-slate-500 text-center">
                                <span className="font-semibold">Actualizado:</span> {format(new Date(), 'EEEE, d MMMM yyyy HH:mm', { locale: es })}
                            </div>
                            <div className="flex items-center justify-between gap-2 ml-auto">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={handleScreenshot}
                                    className="gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Descargar</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedDate(null)}
                                    className="gap-2"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg space-y-4">
                            {groupedVehicles.map(({ shiftKey, vehicles }) => (
                                <div key={shiftKey} className="space-y-2">
                                    <h4 className="font-medium text-sm text-primary">{shiftKey} · {vehicles.length} vehículo{vehicles.length === 1 ? '' : 's'}</h4>
                                    <div className="grid gap-2 grid-cols-1 sm:grid-cols-5 md:grid-cols-7">
                                        {vehicles.map((vehicle: VehicleCalendarEntry) => (
                                            <Badge
                                                key={vehicle.number} // Changed key to just vehicle.number
                                                variant={vehicle.statusInfo ? "default" : "secondary"} // Use default variant if statusInfo
                                                className={cn(
                                                    "justify-center py-1.5 flex items-center gap-2",
                                                    vehicle.statusInfo ? vehicle.statusInfo.color + " text-white" : "" // Apply status color
                                                )}
                                            >
                                                {/* Conditional rendering for status indicator or online status dot */}
                                                {vehicle.statusInfo ? (
                                                    <span className="font-semibold">{vehicle.statusInfo.label.substring(0,3).toUpperCase()}</span>
                                                ) : (
                                                    <span
                                                        className={cn(
                                                            "h-2.5 w-2.5 rounded-full",
                                                            vehicle.isOnline === true ? "bg-green-500" :
                                                            vehicle.isOnline === false ? "bg-red-500" :
                                                            "bg-gray-300"
                                                        )}
                                                    />
                                                )}
                                                {vehicle.number}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {(!groupedVehicles.length && selectedDateSummary && selectedDateSummary.vehicles.length === 0) && (
                                <div className="text-center text-muted-foreground py-8">
                                    No hay vehículos con turnos activos o con estado en esta fecha
                                </div>
                            )}
                             {(!selectedDateSummary || (selectedDateSummary.vehicles.length === 0 && !isLoading)) && (
                                <div className="text-center text-muted-foreground py-8">
                                    No hay vehículos con turnos activos o con estado en esta fecha o para la selección actual.
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
} 