'use client'
import { useState, useCallback, useEffect } from "react"
import { startOfToday, addDays, format } from "date-fns"
import { getVehicleShiftsByDateRange, getVehicleStatusesForCalendar } from "@/lib/database/actions"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import { ShiftsPerVehicleHeader } from "./shifts-per-vehicle-header"
import { ShiftsPerVehicleCalendar } from "./shifts-per-vehicle-calendar"
import type { VehicleShiftWithShiftInfo, VehicleStatus } from "@/lib/types"

interface ShiftsPerVehicleDashboardProps {
    shifts: VehicleShiftWithShiftInfo[]
    daysToShow?: number
    vehicleNumber?: string
    vehicleStatuses: VehicleStatus[]
}

export function ShiftsPerVehicleDashboard({ 
    shifts: initialShifts,
    daysToShow: initialDaysToShow = 90,
    vehicleNumber: initialVehicleNumber,
}: ShiftsPerVehicleDashboardProps) {
    const [vehicleNumber, setVehicleNumber] = useState<string>(initialVehicleNumber || "")
    const [shifts, setShifts] = useState<VehicleShiftWithShiftInfo[]>(initialShifts)
    const [vehicleStatuses, setVehicleStatuses] = useState<VehicleStatus[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [daysToShow, setDaysToShow] = useState(initialDaysToShow)
    const debouncedVehicleNumber = useDebounce(vehicleNumber, 500)
    const { toast } = useToast()

    const fetchData = useCallback(async (vNumber: number) => {
        try {
            setIsLoading(true)
            const today = startOfToday()
            const endDate = addDays(today, daysToShow)
            const startDateStr = format(today, "yyyy-MM-dd")
            const endDateStr = format(endDate, "yyyy-MM-dd")
            
            // Fetch shifts
            const shiftsResult = await getVehicleShiftsByDateRange(
                vNumber,
                startDateStr,
                endDateStr
            )

            if (shiftsResult.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: shiftsResult.error
                })
                setShifts([])
                return
            }

            // Fetch statuses
            const statusesResult = await getVehicleStatusesForCalendar(
                vNumber.toString(),
                startDateStr,
                endDateStr
            )

            setShifts(shiftsResult.data || [])
            setVehicleStatuses(statusesResult || [])
        } catch (error) {
            console.error("Error fetching data:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error al cargar los datos"
            })
            setShifts([])
            setVehicleStatuses([])
        } finally {
            setIsLoading(false)
            setHasSearched(true)
        }
    }, [toast, daysToShow])

    const handleSearch = useCallback(() => {
        if (vehicleNumber && !isNaN(parseInt(vehicleNumber))) {
            fetchData(parseInt(vehicleNumber))
        }
    }, [vehicleNumber, fetchData])

    const handleDaysToShowChange = useCallback((days: number) => {
        setDaysToShow(days)
        if (vehicleNumber && !isNaN(parseInt(vehicleNumber))) {
            fetchData(parseInt(vehicleNumber))
        }
    }, [vehicleNumber, fetchData])

    const handleVehicleNumberChange = useCallback((value: string) => {
        setVehicleNumber(value)
        if (!value) {
            setShifts([])
            setVehicleStatuses([])
            setHasSearched(false)
        }
    }, [])

    useEffect(() => {
        if (debouncedVehicleNumber && !isNaN(parseInt(debouncedVehicleNumber))) {
            setShifts([]) // Clear existing data when input changes
            setVehicleStatuses([])
            setHasSearched(false)
        }
    }, [debouncedVehicleNumber])

    return (
        <Card className="w-full">
            <ShiftsPerVehicleHeader
                vehicleNumber={vehicleNumber}
                onVehicleNumberChange={handleVehicleNumberChange}
                onSearch={handleSearch}
                isLoading={isLoading}
                daysToShow={daysToShow}
                onDaysToShowChange={handleDaysToShowChange}
            />
            <ShiftsPerVehicleCalendar 
                shifts={shifts} 
                hasSearched={hasSearched} 
                daysToShow={daysToShow}
                vehicleNumber={vehicleNumber}
                vehicleStatuses={vehicleStatuses}
            />
        </Card>
    )
} 