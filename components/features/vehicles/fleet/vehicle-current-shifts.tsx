'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { startOfToday, format, isWithinInterval, setHours, setMinutes, setSeconds, setMilliseconds, addDays } from "date-fns"
import { toPng } from "html-to-image"
import { useToast } from "@/hooks/use-toast"
import { TransvipLogo } from "@/components/features/transvip/transvip-logo"
import type { Branch } from "@/lib/core/types/admin"
import { useVehicleCalendarData, type CalendarDaySummary, type VehicleCalendarEntry } from "@/hooks/features/vehicles/use-vehicle-calendar-data"

// UI Components
import { Button, Card, CardHeader } from "@/components/ui"

// Local Components
import {
    BranchSelector,
    ActiveShiftsToggle,
    FleetSummaryHeader,
    FleetDisplay,
    LoadingIndicator,
    EmptyStateMessage
} from "./current-shifts"
import { Search } from "lucide-react"

export function FleetCurrentShifts({ branches }: { branches: Branch[] }) {
    const today = useMemo(() => startOfToday(), []);
    const todayDateStr = useMemo(() => format(today, "yyyy-MM-dd"), [today]);

    const findDefaultBranchId = useCallback(() => {
        const santiagoBranch = branches.find(branch => branch.name.toLowerCase().includes("santiago"));
        if (santiagoBranch) return santiagoBranch.id;
        return branches.length > 0 ? branches[0].id : "";
    }, [branches]);

    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [showOnlyActiveShifts, setShowOnlyActiveShifts] = useState<boolean>(true);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);
    const { toast } = useToast()
    const summaryRef = useRef<HTMLDivElement>(null)

    const { calendarDaysData, isLoading, error, refetchData } = useVehicleCalendarData({
        currentDate: today,
        daysToShow: 1,
        branchId: selectedBranch
    });

    useEffect(() => {
        if (error && hasAttemptedFetch) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error,
            })
        }
    }, [error, toast, hasAttemptedFetch])

    const currentDaySummary = useMemo(() => {
        return calendarDaysData.find((s: CalendarDaySummary) => s.date === todayDateStr) || null
    }, [calendarDaysData, todayDateStr])

    const displayedVehicles = useMemo(() => {
        if (!currentDaySummary?.vehicles) return [];
        if (showOnlyActiveShifts) {
            const now = new Date();
            return currentDaySummary.vehicles.filter((vehicle: VehicleCalendarEntry) => {
                if (vehicle.statusInfo) return true;
                if (vehicle.startTime && vehicle.endTime) {
                    try {
                        const [startHour, startMinute] = vehicle.startTime.split(':').map(Number);
                        const [endHour, endMinute] = vehicle.endTime.split(':').map(Number);
                        const shiftStartDateTime = setMilliseconds(setSeconds(setMinutes(setHours(today, startHour), startMinute), 0), 0);
                        let shiftEndDateTime = setMilliseconds(setSeconds(setMinutes(setHours(today, endHour), endMinute), 0), 0);
                        if (shiftEndDateTime < shiftStartDateTime) {
                            shiftEndDateTime = addDays(shiftEndDateTime, 1);
                        }
                        return isWithinInterval(now, { start: shiftStartDateTime, end: shiftEndDateTime });
                    } catch (e) {
                        console.warn("Error parsing shift times for vehicle:", vehicle.number, e);
                        return false;
                    }
                }
                return false;
            });
        }
        return currentDaySummary.vehicles;
    }, [currentDaySummary, showOnlyActiveShifts, today]);

    const handleBranchSelect = (branchId: string) => {
        setSelectedBranch(branchId);
        setHasAttemptedFetch(false);
    };

    const handleFetchData = useCallback(async () => {
        if (!selectedBranch) {
            toast({
                variant: "default",
                title: "Acción Requerida",
                description: "Por favor, seleccione una sucursal para continuar.",
            });
            return;
        }
        setHasAttemptedFetch(true);
        await refetchData();
    }, [selectedBranch, refetchData, toast]);

    const handleScreenshot = async () => {
        if (!summaryRef.current || !currentDaySummary) return
        try {
            const dataUrl = await toPng(summaryRef.current, { quality: 1.0, backgroundColor: 'white' })
            const link = document.createElement('a')
            link.download = `estado-flota-hoy-${format(today, 'yyyy-MM-dd')}.png`
            link.href = dataUrl
            link.click()
            toast({ title: "Éxito", description: "Resumen guardado como imagen" })
        } catch (err) {
            console.error('Error al generar la imagen:', err)
            toast({ variant: "destructive", title: "Error", description: "No se pudo generar la imagen del resumen" })
        }
    }

    const vehiclesByShift = useMemo(() => {
        if (!displayedVehicles || displayedVehicles.length === 0) return {};
        return displayedVehicles.reduce((acc, vehicle) => {
            const shiftKey = vehicle.shiftName || "Sin Turno Asignado";
            if (!acc[shiftKey]) acc[shiftKey] = [];
            acc[shiftKey].push(vehicle);
            return acc;
        }, {} as Record<string, VehicleCalendarEntry[]>);
    }, [displayedVehicles]);

    const renderContent = () => {
        if (!selectedBranch) {
            return <Card className="p-6"><EmptyStateMessage message="Seleccione una sucursal y luego presione 'Ver Estado de Flota'." /></Card>;
        }

        if (isLoading && hasAttemptedFetch) {
            return <LoadingIndicator />;
        }

        if (!hasAttemptedFetch) {
            return <Card className="p-6"><EmptyStateMessage message="Presione 'Ver Estado de Flota' para cargar los datos de la sucursal seleccionada." /></Card>;
        }

        if (!currentDaySummary) {
            return <Card className="p-6"><EmptyStateMessage message="No se encontraron datos para la sucursal seleccionada para el día de hoy o la carga ha fallado." /></Card>;
        }
        
        if (branches.length === 0) {
            return <Card className="p-6"><EmptyStateMessage message="No hay sucursales configuradas para mostrar." /></Card>;
        }

        return (
            <Card ref={summaryRef} className="p-6">
                <div className="space-y-4">
                    <FleetSummaryHeader
                        currentDate={today}
                        displayedVehiclesCount={displayedVehicles.length}
                        onDownload={handleScreenshot}
                        isDownloadDisabled={!currentDaySummary || displayedVehicles.length === 0}
                    />
                    <div className="bg-white rounded-lg space-y-4 pt-4">
                        <FleetDisplay vehiclesByShift={vehiclesByShift} showOnlyActiveShifts={showOnlyActiveShifts} />
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-2 max-w-full">
            <Card className="p-0">
                <CardHeader className="gap-2 space-y-0">
                    <div className="flex gap-2 items-center">
                        <TransvipLogo size={20} />
                        <h2 className="font-semibold text-lg">Actividad de Flota Hoy</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Seleccione una sucursal y presione el botón para ver el estado actual de los vehículos.
                    </p>
                    <div className="flex items-end gap-4">
                        <div className="flex-0">
                            <BranchSelector
                                branches={branches}
                                selectedBranch={selectedBranch}
                                onSelectBranch={handleBranchSelect}
                                isLoading={isLoading && hasAttemptedFetch}
                            />
                        </div>
                        <Button
                            onClick={handleFetchData} 
                            disabled={!selectedBranch || (isLoading && hasAttemptedFetch)} 
                            className="whitespace-nowrap"
                        >
                            <Search className="w-4 h-4" />
                            {(isLoading && hasAttemptedFetch) ? "Cargando..." : "Ver Estado de Flota"}
                        </Button>
                    </div>
                    <ActiveShiftsToggle
                        isChecked={!showOnlyActiveShifts}
                        onCheckedChange={() => setShowOnlyActiveShifts(!showOnlyActiveShifts)}
                    />
                </CardHeader>
            </Card>
            {renderContent()}
        </div>
    )
} 