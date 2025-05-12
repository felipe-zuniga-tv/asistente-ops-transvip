'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { startOfToday, format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, X, Download } from "lucide-react"
import { toPng } from "html-to-image"
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/utils/ui'
import { TransvipLogo } from "@/components/features/transvip/transvip-logo"
import { generateNextXDays, generateCalendarMonths } from "@/utils/date"
import type { ShiftSummary } from "@/lib/core/types/calendar"
import type { Branch } from "@/lib/core/types/admin"
import { useVehicleShifts } from "@/hooks/features/vehicles/use-vehicle-shifts"

// UI Components
import { Badge, Button, Calendar, CalendarGrid, Card, Label, Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"

interface ShiftOption {
    value: string
    label: string
}

// Define a more specific type for vehicles within ShiftSummary if needed for clarity in callbacks
interface VehicleInSummary {
    number: number;
    shiftName: string;
    startTime?: string;
    endTime?: string;
    isOnline?: boolean;
}

export function VehicleShiftsSummary({ branches }: { branches: Branch[] }) {
    const [date, setDate] = useState<Date>(startOfToday())
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedBranch, setSelectedBranch] = useState<string>("")
    const { toast } = useToast()
    const summaryRef = useRef<HTMLDivElement>(null)

    const {
        summaries, // This should be ShiftSummary[] from the hook
        isLoading,
        error,
        refetchSummaries
    } = useVehicleShifts({
        currentDate: date,
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
        return summaries.find((s: ShiftSummary) => s.date === selectedDate)
    }, [selectedDate, summaries])

    const nextDays = useMemo(() => generateNextXDays(30), [])
    const months = useMemo(() => generateCalendarMonths(nextDays), [nextDays])

    const renderCell = useCallback((dateToRender: Date) => {
        const dateStr = format(dateToRender, "yyyy-MM-dd")
        const summary: ShiftSummary | undefined = summaries.find((s: ShiftSummary) => s.date === dateStr)
        const vehicleCount = summary?.vehicles.length || 0
        const isSelected = selectedDate === dateStr

        let onlineCount = 0
        let offlineCount = 0
        // Removed unknownStatusCount as it was not used for cellBgColor logic directly
        let cellBgColor = "hover:bg-muted/50" // Default for no vehicles
        let statusText = "Sin vehículos"
        let statusTextColor = "text-red-600"

        if (vehicleCount > 0 && summary) {
            onlineCount = summary.vehicles.filter((v: VehicleInSummary) => v.isOnline === true).length
            offlineCount = summary.vehicles.filter((v: VehicleInSummary) => v.isOnline === false).length
            // unknownStatusCount = vehicleCount - onlineCount - offlineCount; // Recalculate if needed elsewhere

            if (summary.vehicles.every((v: VehicleInSummary) => v.isOnline === undefined)) {
                cellBgColor = "bg-blue-50 hover:bg-blue-100"
                statusText = `${vehicleCount} móvil${vehicleCount !== 1 ? 'es' : ''}`
                statusTextColor = "text-blue-600"
            } else if (onlineCount === vehicleCount) {
                cellBgColor = "bg-green-50 hover:bg-green-100"
                statusText = `${onlineCount}/${vehicleCount} online`
                statusTextColor = "text-green-700"
            } else if (onlineCount > 0) {
                cellBgColor = "bg-yellow-50 hover:bg-yellow-100"
                statusText = `${onlineCount}/${vehicleCount} online`
                statusTextColor = "text-yellow-700"
            } else { 
                cellBgColor = "bg-red-50 hover:bg-red-100"
                statusText = `${onlineCount}/${vehicleCount} online`
                statusTextColor = "text-red-700"
            }
        } else {
             cellBgColor = "hover:bg-muted/50"
        }

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
                <div className="text-xs font-medium">
                    {format(dateToRender, "d", { locale: es })}
                </div>
                <div className={cn("text-xs font-medium text-center pt-1.5", statusTextColor)}>
                    {statusText}
                </div>
            </div>
        )
    }, [selectedDate, summaries]) // Added dateToRender to dependencies of renderCell if format relies on it directly (it does)
                                  // However, renderCell is a callback passed to CalendarGrid, its deps are for its own memoization if wrapped in useCallback
                                  // The parameters it receives (dateToRender) come from CalendarGrid during mapping.
                                  // Corrected dependencies for useCallback are [selectedDate, summaries, setSelectedDate]
                                  // Let's stick to the original dependencies for now [selectedDate, summaries] as setSelectedDate is stable.

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
        if (!selectedDateSummary) return []

        const groups = new Map<string, VehicleInSummary[]>()
        selectedDateSummary.vehicles.forEach((vehicle: VehicleInSummary) => {
            const shiftKey = `${vehicle.shiftName} (${vehicle.startTime} - ${vehicle.endTime})`
            if (!groups.has(shiftKey)) {
                groups.set(shiftKey, [])
            }
            groups.get(shiftKey)?.push({ number: vehicle.number, isOnline: vehicle.isOnline, shiftName: vehicle.shiftName, startTime: vehicle.startTime, endTime: vehicle.endTime })
        })

        return Array.from(groups.entries()).map(([key, vehicles]) => ({
            shiftKey: key,
            vehicles: vehicles.sort((a, b) => a.number - b.number)
        }))
    }, [selectedDateSummary])

    return (
        <div className="space-y-2 max-w-full">
            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex flex-col space-y-1.5">
                        <div className="flex gap-2 items-center">
                            <TransvipLogo size={20} />
                            <h2 className="font-semibold text-lg">Resumen de Turnos por Fecha</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Seleccione una fecha y sucursal para ver los vehículos con turno en los próximos 30 días
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
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
                            <Label className="text-sm text-muted-foreground">Fecha de inicio</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="h-4 w-4" />
                                        {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(newDate) => newDate && setDate(newDate)}
                                        locale={es}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <Button
                            onClick={refetchSummaries} // Calls the function from the hook
                            disabled={isLoading}
                            className="bg-transvip text-white hover:bg-transvip/90"
                        >
                            {isLoading ? "Cargando..." : "Buscar"}
                        </Button>
                    </div>
                </div>
            </Card>

            {summaries.length > 0 && (
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
                                        {vehicles.map((vehicle: VehicleInSummary) => (
                                            <Badge
                                                key={vehicle.number + "_" + Math.random()} // Using Math.random() for keys is not ideal, consider a more stable key if possible
                                                variant="secondary"
                                                className="justify-center py-1.5 flex items-center gap-2"
                                            >
                                                <span
                                                    className={cn(
                                                        "h-2.5 w-2.5 rounded-full",
                                                        vehicle.isOnline === true ? "bg-green-500" :
                                                        vehicle.isOnline === false ? "bg-red-500" :
                                                        "bg-gray-300"
                                                    )}
                                                />
                                                {vehicle.number}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {(!groupedVehicles.length && selectedDateSummary && selectedDateSummary.vehicles.length === 0) && (
                                <div className="text-center text-muted-foreground py-8">
                                    No hay vehículos con turnos activos en esta fecha
                                </div>
                            )}
                             {(!selectedDateSummary || selectedDateSummary.vehicles.length === 0 && !isLoading) && (
                                <div className="text-center text-muted-foreground py-8">
                                    No hay vehículos con turnos activos en esta fecha o para la selección actual.
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
} 