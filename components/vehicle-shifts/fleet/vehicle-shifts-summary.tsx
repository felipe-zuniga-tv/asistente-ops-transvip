'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { startOfToday, addDays, format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { getVehicleShiftsByDateRange } from "@/lib/database/actions"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, X, Download } from "lucide-react"
import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { Label } from "@/components/ui/label"
import { CalendarGrid } from "@/components/ui/calendar-grid"
import { generateNextXDays, generateCalendarMonths } from "@/lib/utils/date"
import { toPng } from "html-to-image"
import type { ShiftSummary } from "@/lib/types/calendar"
import {
    Badge,
} from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getBranches } from "@/lib/services/admin/index"
import type { Branch } from "@/lib/types/admin"

interface ShiftOption {
    value: string
    label: string
}

export function VehicleShiftsSummary() {
    const [date, setDate] = useState<Date>(startOfToday())
    const [summaries, setSummaries] = useState<ShiftSummary[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [branches, setBranches] = useState<Branch[]>([])
    const [selectedBranch, setSelectedBranch] = useState<string>("")
    const { toast } = useToast()
    const summaryRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const branchesData = await getBranches()
                setBranches(branchesData)
            } catch (error) {
                console.error('Error fetching branches:', error)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error al cargar las sucursales"
                })
            }
        }
        fetchBranches()
    }, [toast])

    const fetchShiftsSummary = useCallback(async () => {
        try {
            setIsLoading(true)
            const endDate = addDays(date, 30)
            const startDateStr = format(date, "yyyy-MM-dd")
            const endDateStr = format(endDate, "yyyy-MM-dd")

            const result = await getVehicleShiftsByDateRange(
                0,
                startDateStr,
                endDateStr,
                selectedBranch === "all" ? undefined : selectedBranch
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
            const shiftsMap = new Map<string, any[]>()
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
            const newSummaries: ShiftSummary[] = Array
                .from(shiftsMap.entries())
                .map(([date, shifts]) => ({
                    date,
                    vehicles: shifts.map(shift => ({
                        number: shift.vehicle_number,
                        shiftName: shift.shift_name,
                        startTime: shift.start_time,
                        endTime: shift.end_time
                    })).sort((a, b) => a.number - b.number)
                }))
                .sort((a, b) => a.date.localeCompare(b.date))

            setSummaries(newSummaries)
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
    }, [date, selectedBranch, toast])

    const selectedDateSummary = useMemo(() => {
        if (!selectedDate) return null
        return summaries.find(s => s.date === selectedDate)
    }, [selectedDate, summaries])

    const nextDays = useMemo(() => generateNextXDays(30), [])
    const months = useMemo(() => generateCalendarMonths(nextDays), [nextDays])

    const renderCell = useCallback((date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd")
        const summary = summaries.find(s => s.date === dateStr)
        const vehicleCount = summary?.vehicles.length || 0
        const isSelected = selectedDate === dateStr

        return (
            <div
                key={dateStr}
                className={cn(
                    "p-1 border rounded-sm min-h-[3.5rem] text-left hover:cursor-pointer hover:border-muted-foreground",
                    isSelected ? "ring-2 ring-primary" : "",
                    vehicleCount > 0 ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-muted/50"
                )}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
            >
                <div className="text-xs font-medium">
                    {format(date, "d", { locale: es })}
                </div>
                {vehicleCount > 0 && (
                    <div className="text-xs text-blue-600 font-medium text-center pt-1.5">
                        {vehicleCount} móvil{vehicleCount !== 1 ? 'es' : ''}
                    </div>
                )}
                {vehicleCount === 0 && (
                    <div className="text-sm text-red-600 font-medium text-center pt-0">
                        Sin vehículos
                    </div>
                )}
            </div>
        )
    }, [selectedDate, summaries])

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
        
        const groups = new Map<string, number[]>()
        selectedDateSummary.vehicles.forEach(vehicle => {
            const shiftKey = `${vehicle.shiftName} (${vehicle.startTime} - ${vehicle.endTime})`
            if (!groups.has(shiftKey)) {
                groups.set(shiftKey, [])
            }
            groups.get(shiftKey)?.push(vehicle.number)
        })

        return Array.from(groups.entries()).map(([key, vehicles]) => ({
            shiftKey: key,
            vehicles: vehicles.sort((a, b) => a - b)
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
                                        initialFocus
                                        locale={es}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <Button
                            onClick={fetchShiftsSummary}
                            disabled={isLoading}
                            className="bg-transvip text-white hover:bg-transvip/90"
                        >
                            {isLoading ? "Cargando..." : "Buscar"}
                        </Button>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <CalendarGrid months={months} renderCell={renderCell} />
            </Card>

            {selectedDate && (
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
                                        {vehicles.map((vehicleNumber) => (
                                            <Badge
                                                key={vehicleNumber}
                                                variant="secondary"
                                                className="justify-center py-1.5"
                                            >
                                                {vehicleNumber}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {(!groupedVehicles.length) && (
                                <div className="text-center text-muted-foreground py-8">
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