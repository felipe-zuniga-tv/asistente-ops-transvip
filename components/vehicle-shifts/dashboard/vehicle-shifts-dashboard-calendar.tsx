import { addDays, format, startOfToday, getDay, isSameMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"
import { CardContent } from "@/components/ui/card"
import { VehicleShift } from "@/components/vehicle-shifts/vehicle-shifts"
import { CalendarX2, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import { toPng } from "html-to-image"
import { useToast } from "@/hooks/use-toast"
import React from "react"
import { VehicleStatus } from "@/lib/types"

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
    free_day?: number;
    status_color?: string;
    isStatus?: boolean;
    shift_id: string;
    priority: number;
    created_at: string;
}

interface VehicleShiftWithFreeDay extends VehicleShiftWithShiftInfo {
    isFreeDay?: boolean;
    isStatus?: boolean;
    status_color?: string;
}

function getHighestPriorityShiftForDate(shifts: VehicleShiftWithShiftInfo[], date: Date, statuses?: VehicleStatus[]): VehicleShiftWithFreeDay | undefined {
    const dateStr = format(date, "yyyy-MM-dd")
    const dayOfWeek = adjustDayIndex(date) + 1 // Convert to 1-7 range where Monday = 1

    // First check if there's a vehicle status for this date
    if (statuses?.length) {
        const status = statuses.find(status =>
            dateStr >= status.start_date &&
            dateStr <= status.end_date
        );

        if (status) {
            return {
                id: status.id,
                vehicle_number: Number(status.vehicle_number),
                shift_name: status.status_label,
                start_date: status.start_date,
                end_date: status.end_date,
                shift_id: status.status_id,
                priority: 100, // Status always takes precedence
                created_at: status.created_at,
                start_time: undefined,
                end_time: undefined,
                status_color: status.status_color,
                isStatus: true
            };
        }
    }

    // If no status, check for shifts
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
    return !isSameMonth(date, prevDate)
}

interface VehicleShiftsDashboardCalendarProps {
    shifts: VehicleShiftWithShiftInfo[]
    hasSearched?: boolean
    daysToShow: number
    vehicleNumber?: string
    vehicleStatuses?: VehicleStatus[]
}

function generateCalendarMonths(days: Date[]) {
    const months: { date: Date; days: Date[] }[] = []
    let currentMonth: Date[] = []

    days.forEach((date, index) => {
        if (index === 0 || !isSameMonth(date, days[index - 1])) {
            if (currentMonth.length > 0) {
                months.push({ date: currentMonth[0], days: currentMonth })
            }
            currentMonth = [date]
        } else {
            currentMonth.push(date)
        }
    })

    if (currentMonth.length > 0) {
        months.push({ date: currentMonth[0], days: currentMonth })
    }

    return months
}

export function VehicleShiftsDashboardCalendar({ shifts, hasSearched, daysToShow, vehicleNumber, vehicleStatuses }: VehicleShiftsDashboardCalendarProps) {
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

    const months = generateCalendarMonths(nextDays)

    return (
        <CardContent>
            <div className="flex justify-end">
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
            <div ref={calendarRef} className="grid gap-6 bg-white p-4 rounded-lg">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-lg font-semibold text-slate-700 text-center">
                        Jornadas de Conexión · Móvil {vehicleNumber}
                    </div>
                    <div className="text-xs text-slate-500 text-center">
                        {format(new Date(), 'EEEE, d MMMM yyyy HH:mm', { locale: es })}
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                    {weekDays.map((day) => (
                        <div key={day} className="text-center font-semibold p-1 text-sm bg-muted shadow">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="space-y-6">
                    {months.map(({ date: monthDate, days }) => {
                        const firstDayIndex = adjustDayIndex(days[0])

                        return (
                            <div key={`month-${monthDate.toISOString()}`} className="space-y-1.5">
                                <div className="text-sm font-semibold">
                                    {format(monthDate, "MMMM yyyy", { locale: es })}
                                </div>
                                <div className="grid grid-cols-7 gap-1.5">
                                    {false && weekDays.map((day) => (
                                        <div key={day} className="text-center font-semibold p-1 text-sm bg-muted shadow">
                                            {day}
                                        </div>
                                    ))}

                                    {/* Empty cells for first week alignment */}
                                    {Array.from({ length: firstDayIndex }, (_, i) => (
                                        <div key={`empty-start-${i}`} className="p-1 border-0 rounded-sm min-h-[4rem] bg-transparent" />
                                    ))}

                                    {/* Days of the month */}
                                    {days.map((date) => {
                                        const shift = getHighestPriorityShiftForDate(shifts, date, vehicleStatuses)

                                        return (
                                            <div
                                                key={date.toISOString()}
                                                className={`p-1 border rounded-sm transition-colors min-h-[4rem] ${
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
                                                            shift.isStatus ? 'text-gray-800 font-medium' :
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
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </CardContent>
    )
} 