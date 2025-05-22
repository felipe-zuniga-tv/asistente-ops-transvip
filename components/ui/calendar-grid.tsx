import { format } from "date-fns"
import { es } from "date-fns/locale"
import { weekDays, adjustDayIndex } from "@/utils/date"
import type { CalendarMonth } from "@/types/domain/calendar/types"
import { date } from "zod"

interface CalendarGridProps {
    months: CalendarMonth[]
    renderCell: (date: Date) => React.ReactNode
}

export function CalendarGrid({ months, renderCell }: CalendarGridProps) {
    return (
        <div className="space-y-6 w-full">
            <div className="grid grid-cols-7 gap-1.5">
                {weekDays.map((day) => (
                    <div key={day} className="text-center font-semibold p-1 text-sm text-muted-foreground border-b">
                        {day}
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                {months.map(({ date: monthDate, days }) => {
                    const firstDayIndex = adjustDayIndex(days[0])

                    return (
                        <div key={`month-${monthDate.toISOString()}`} className="space-y-1.5">
                            <div className="text-sm font-semibold">
                                {format(monthDate, "MMMM yyyy", { locale: es })}
                            </div>
                            <div className="grid grid-cols-7 gap-1.5">
                                {/* Empty cells for first week alignment */}
                                {Array.from({ length: firstDayIndex }, (_, i) => (
                                    <div key={`empty-start-${i}`} className="p-1 border-0 rounded-sm min-h-[3rem] bg-transparent" />
                                ))}

                                {/* Days of the month */}
                                {days.map((date) => renderCell(date))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
} 