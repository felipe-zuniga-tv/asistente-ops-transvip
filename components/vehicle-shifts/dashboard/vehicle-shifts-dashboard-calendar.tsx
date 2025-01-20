import { addDays, format, startOfToday, getDay } from "date-fns"
import { es } from "date-fns/locale"
import { CardContent } from "@/components/ui/card"
import { VehicleShift } from "@/components/vehicle-shifts/vehicle-shifts"
import { CalendarX2, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import { toPng } from "html-to-image"
import { useToast } from "@/hooks/use-toast"
import React from "react"

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

function generateNextXDays(next_X_days: number) {
    const today = startOfToday()
    return Array.from({ length: next_X_days }, (_, i) => addDays(today, i))
}

// Helper function to adjust day index to start from Monday
function adjustDayIndex(date: Date): number {
    const day = getDay(date)
    return day === 0 ? 6 : day - 1 // Convert Sunday (0) to 6, and shift other days back by 1
}

interface VehicleShiftWithShiftInfo extends VehicleShift {
    free_day?: number
}

interface VehicleShiftWithFreeDay extends VehicleShiftWithShiftInfo {
    isFreeDay?: boolean
}

function getHighestPriorityShiftForDate(shifts: VehicleShiftWithShiftInfo[], date: Date): VehicleShiftWithFreeDay | undefined {
    const dateStr = format(date, "yyyy-MM-dd")
    const dayOfWeek = adjustDayIndex(date) + 1 // Convert to 1-7 range where Monday = 1
    
    const shift = shifts.find(shift => 
        dateStr >= shift.start_date && 
        dateStr <= shift.end_date
    )

    if (shift?.free_day === dayOfWeek) {
        return { ...shift, isFreeDay: true }
    }

    return shift
}

function shouldShowMonth(date: Date, index: number, days: Date[]) {
    if (index === 0) return true
    const prevDate = days[index - 1]
    return date.getMonth() !== prevDate.getMonth()
}

interface VehicleShiftsDashboardCalendarProps {
    shifts: VehicleShiftWithShiftInfo[]
    hasSearched?: boolean
    daysToShow: number
    vehicleNumber?: string
}

export function VehicleShiftsDashboardCalendar({ shifts, hasSearched, daysToShow, vehicleNumber }: VehicleShiftsDashboardCalendarProps) {
    const nextDays = generateNextXDays(daysToShow)
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

    return (
        <CardContent>
            <div className="flex justify-end mb-4">
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleScreenshot}
                    className="gap-2"
                >
                    <Camera className="h-4 w-4" />
                    <span>Capturar calendario</span>
                </Button>
            </div>
            <div ref={calendarRef} className="grid grid-cols-7 gap-1.5 bg-white p-4 rounded-lg">
                <div className="col-span-7 mb-4">
                    <span className="text-xl font-semibold text-slate-700 text-center">
                        Jornadas de conexión - Móvil {vehicleNumber}
                    </span>
                </div>
                {/* Week day headers */}
                {weekDays.map((day) => (
                    <div key={day} className="text-center font-semibold p-1 text-sm bg-muted">
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {nextDays.map((date, index, array) => {
                    const shift = getHighestPriorityShiftForDate(shifts, date)
                    const dayIndex = adjustDayIndex(date)
                    
                    // Add empty cells for the first week if needed
                    const emptyCells = index === 0 && dayIndex > 0 && Array.from({ length: dayIndex }, (_, i) => (
                        <div key={`empty-${i}-${date.toISOString()}`} className="p-1 border rounded-sm min-h-[4rem] bg-gray-50" />
                    ))

                    // Add month header if needed, but only at the start of a week
                    const shouldAddMonthHeader = shouldShowMonth(date, index, array)
                    const monthHeader = shouldAddMonthHeader && (dayIndex === 0 || index === 0) && (
                        <div key={`month-header-${date.toISOString()}`} className="col-span-7 text-sm font-semibold pt-2 pb-1 mt-1">
                            {format(date, "MMMM yyyy", { locale: es })}
                        </div>
                    )

                    // If it's a new month but not the start of a week, add a small indicator
                    const isNewMonth = shouldAddMonthHeader && !monthHeader
                    const monthIndicator = isNewMonth && (
                        <div className="absolute top-1 right-1 text-[0.65rem] font-medium text-muted-foreground bg-slate-700 text-white px-1 rounded">
                            {format(date, "MMM", { locale: es })}
                        </div>
                    )

                    return (
                        <React.Fragment key={`day-${date.toISOString()}`}>
                            {monthHeader}
                            {emptyCells}
                            <div
                                className={`relative p-1 border rounded-sm transition-colors min-h-[4rem] ${
                                    shift?.isFreeDay ? "bg-green-50 hover:bg-green-100" :
                                    shift ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-muted/50"
                                }`}
                            >
                                {monthIndicator}
                                <div className="text-xs font-medium pb-2">
                                    {format(date, "d", { locale: es })}
                                </div>
                                {shift && (
                                    <div className="space-y-0.5">
                                        <div className={`text-[0.8rem] ${shift.isFreeDay ? 'text-green-600' : 'text-blue-600'} font-medium truncate`}>
                                            {shift.isFreeDay ? 'Libre' : shift.shift_name}
                                        </div>
                                        {!shift.isFreeDay && shift.start_time && shift.end_time && (
                                            <div className="text-[0.7rem] text-muted-foreground">
                                                {shift.start_time} - {shift.end_time}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    )
                })}
            </div>
        </CardContent>
    )
} 