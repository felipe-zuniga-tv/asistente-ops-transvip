import { addDays, startOfToday, getDay, isSameMonth } from "date-fns"

export const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

// Helper function to adjust day index to start from Monday
export function adjustDayIndex(date: Date): number {
    const day = getDay(date)
    return day === 0 ? 6 : day - 1 // Convert Sunday (0) to 6, and shift other days back by 1
}

export function generateNextXDays(next_X_days: number) {
    const today = startOfToday()
    return Array.from({ length: next_X_days }, (_, i) => addDays(today, i))
}

export function generateCalendarMonths(days: Date[]) {
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