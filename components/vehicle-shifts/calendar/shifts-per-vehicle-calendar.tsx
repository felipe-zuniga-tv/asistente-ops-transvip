import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CardContent } from "@/components/ui/card"
import { CalendarX2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import { toPng } from "html-to-image"
import { useToast } from "@/hooks/use-toast"
import React from "react"
import { VehicleStatus } from "@/lib/types"
import { CalendarGrid } from "@/components/ui/calendar-grid"
import { generateNextXDays, generateCalendarMonths } from "@/lib/utils/date"
import { getHighestPriorityShiftForDate } from "@/lib/utils/shifts"
import type { VehicleShiftWithShiftInfo } from "@/lib/types/calendar"

interface ShiftsPerVehicleCalendarProps {
    shifts: VehicleShiftWithShiftInfo[]
    hasSearched?: boolean
    daysToShow: number
    vehicleNumber?: string
    vehicleStatuses?: VehicleStatus[]
}

export function ShiftsPerVehicleCalendar({ shifts, hasSearched, daysToShow, vehicleNumber, vehicleStatuses }: ShiftsPerVehicleCalendarProps) {
    const nextDays = generateNextXDays(daysToShow)
    const months = generateCalendarMonths(nextDays)
    const calendarRef = useRef<HTMLDivElement>(null)
    const { toast } = useToast()

    const handleScreenshot = async () => {
        if (!calendarRef.current) return

        try {
            const dataUrl = await toPng(calendarRef.current, {
                quality: 1.0,
                backgroundColor: 'white',
            })

            // Create a link element and trigger download
            const link = document.createElement('a')
            link.download = `jornadas-movil-${vehicleNumber}-${format(new Date(), 'yyyy-MM-dd')}.png`
            link.href = dataUrl
            link.click()

            toast({
                title: "Éxito",
                description: "Calendario guardado como imagen",
            })
        } catch (err) {
            console.error('Error al generar la imagen:', err)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo generar la imagen del calendario",
            })
        }
    }

    if (!hasSearched) {
        return (
            <CardContent>
                <div className="flex flex-col gap-4 items-center justify-center py-16 text-muted-foreground">
                    <p className="text-sm">Ingrese un número de móvil para ver sus turnos</p>
                </div>
            </CardContent>
        )
    }

    if (shifts.length === 0) {
        return (
            <CardContent>
                <div className="flex flex-col gap-8 items-center justify-center py-8 text-muted-foreground">
                    <CalendarX2 className="h-10 w-10" />
                    <p className="text-sm">No se encontraron turnos para este móvil en los próximos {daysToShow} días</p>
                </div>
            </CardContent>
        )
    }

    const renderCell = (date: Date) => {
        const shift = getHighestPriorityShiftForDate(shifts, date, vehicleStatuses)

        return (
            <div key={date.toISOString()}
                className={`p-1 border rounded-sm transition-colors min-h-[3.5rem] ${
                    shift?.isFreeDay ? "bg-green-50 hover:bg-green-100" :
                    shift?.isStatus ? `bg-opacity-10 hover:bg-opacity-20` :
                    shift ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-muted/50"
                }`}
                style={shift?.isStatus ? { backgroundColor: shift.status_color } : undefined}
            >
                <div className="text-xs font-medium pb-2">
                    {format(date, "d", { locale: es })}
                </div>
                {shift && (
                    <div className="space-y-0.5">
                        <div className={`text-[0.8rem] ${
                            shift.isFreeDay ? 'text-green-600' :
                            shift.isStatus ? 'text-black font-medium' :
                            'text-blue-600'
                        } font-medium truncate`}>
                            {shift.isFreeDay ? 'Libre' : shift.shift_name}
                        </div>
                        {!shift.isFreeDay && !shift.isStatus && shift.start_time && shift.end_time && (
                            <div className="text-[0.7rem] text-muted-foreground">
                                {shift.start_time} - {shift.end_time}
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <CardContent>
            <div className="flex justify-end">
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleScreenshot}
                    className="gap-2"
                >
                    <Download className="h-4 w-4" />
                    <span>Descargar calendario</span>
                </Button>
            </div>
            <div ref={calendarRef} className="grid gap-6 bg-white rounded-lg">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-lg font-semibold text-slate-700 text-center">
                        Jornadas de Conexión · Móvil {vehicleNumber}
                    </div>
                    <div className="text-xs text-slate-500 text-center">
                        Fecha: {format(new Date(), 'EEEE, d MMMM yyyy HH:mm', { locale: es })}
                    </div>
                </div>

                <CalendarGrid months={months} renderCell={renderCell} />
            </div>
        </CardContent>
    )
} 