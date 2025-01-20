'use client'
import { useState, useCallback, useEffect } from "react"
import { startOfToday, addDays, format } from "date-fns"
import { VehicleShift } from "@/components/vehicle-shifts/vehicle-shifts"
import { getVehicleShiftsByDateRange } from "@/lib/vehicle-shifts/actions"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import { VehicleShiftsDashboardHeader } from "./vehicle-shifts-dashboard-header"
import { VehicleShiftsDashboardCalendar } from "./vehicle-shifts-dashboard-calendar"

interface VehicleShiftsDashboardProps {
    daysToShow?: number
}

export function VehicleShiftsDashboard({ daysToShow: initialDaysToShow = 90 }: VehicleShiftsDashboardProps) {
    const [vehicleNumber, setVehicleNumber] = useState<string>("")
    const [shifts, setShifts] = useState<VehicleShift[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [daysToShow, setDaysToShow] = useState(initialDaysToShow)
    const debouncedVehicleNumber = useDebounce(vehicleNumber, 500)
    const { toast } = useToast()

    const fetchShifts = useCallback(async (vNumber: number) => {
        try {
            setIsLoading(true)
            const today = startOfToday()
            const endDate = addDays(today, daysToShow)
            
            const result = await getVehicleShiftsByDateRange(
                vNumber,
                format(today, "yyyy-MM-dd"),
                format(endDate, "yyyy-MM-dd")
            )

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error
                })
                setShifts([])
                return
            }

            setShifts(result.data || [])
        } catch (error) {
            console.error("Error fetching shifts:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error al cargar los turnos"
            })
            setShifts([])
        } finally {
            setIsLoading(false)
            setHasSearched(true)
        }
    }, [toast, daysToShow])

    const handleSearch = useCallback(() => {
        if (vehicleNumber && !isNaN(parseInt(vehicleNumber))) {
            fetchShifts(parseInt(vehicleNumber))
        }
    }, [vehicleNumber, fetchShifts])

    const handleDaysToShowChange = useCallback((days: number) => {
        setDaysToShow(days)
        if (vehicleNumber && !isNaN(parseInt(vehicleNumber))) {
            fetchShifts(parseInt(vehicleNumber))
        }
    }, [vehicleNumber, fetchShifts])

    const handleVehicleNumberChange = useCallback((value: string) => {
        setVehicleNumber(value)
        if (!value) {
            setShifts([])
            setHasSearched(false)
        }
    }, [])

    useEffect(() => {
        if (debouncedVehicleNumber && !isNaN(parseInt(debouncedVehicleNumber))) {
            setShifts([]) // Clear existing shifts when input changes
            setHasSearched(false)
        }
    }, [debouncedVehicleNumber])

    return (
        <Card className="w-full">
            <VehicleShiftsDashboardHeader
                vehicleNumber={vehicleNumber}
                onVehicleNumberChange={handleVehicleNumberChange}
                onSearch={handleSearch}
                isLoading={isLoading}
                daysToShow={daysToShow}
                onDaysToShowChange={handleDaysToShowChange}
            />
            <VehicleShiftsDashboardCalendar 
                shifts={shifts} 
                hasSearched={hasSearched} 
                daysToShow={daysToShow}
                vehicleNumber={vehicleNumber}
            />
        </Card>
    )
} 