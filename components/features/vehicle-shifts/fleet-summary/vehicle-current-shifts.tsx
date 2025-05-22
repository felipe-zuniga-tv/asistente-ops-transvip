'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { startOfToday, format, isWithinInterval, setHours, setMinutes, setSeconds, setMilliseconds, addDays } from "date-fns"
import { toPng } from "html-to-image"
import { useToast } from "@/hooks/use-toast"
import { TransvipLogo } from "@/components/features/transvip/transvip-logo"
import type { Branch } from "@/types/domain/admin/types"
import { useVehicleCalendarData } from "@/hooks/vehicles/use-vehicle-calendar-data"
import { useVehicleOnlineStatus } from "@/hooks/vehicles/use-vehicle-online-status"
import type { CalendarDaySummary, VehicleCalendarEntry as BaseVehicleCalendarEntry } from "@/types/domain/calendar/types"
import type { VehicleOnlineStatus } from "@/types/domain/vehicle/types"

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

// Define a new type for the vehicle entry that includes online status
interface EnrichedVehicleCalendarEntry extends BaseVehicleCalendarEntry {
    isOnline?: boolean;
    lastOnlineStatusUpdate?: number;
}

// Helper hook to derive displayed vehicles and vehicles by shift
function useDerivedFleetData(
    currentDaySummary: CalendarDaySummary | null,
    showOnlyActiveShifts: boolean,
    today: Date,
    vehicleOnlineStatusData: Map<number, VehicleOnlineStatus>
) {
    const enrichedVehiclesForDay = useMemo(() => {
        if (!currentDaySummary?.vehicles) return [];
        return currentDaySummary.vehicles.map(vehicle => {
            const onlineStatus = vehicleOnlineStatusData.get(vehicle.number);
            return {
                ...vehicle,
                isOnline: onlineStatus?.isOnline,
                lastOnlineStatusUpdate: onlineStatus?.timestamp,
            };
        }) as EnrichedVehicleCalendarEntry[];
    }, [currentDaySummary, vehicleOnlineStatusData]);

    const displayedVehicles = useMemo(() => {
        if (!enrichedVehiclesForDay) return [];
        if (showOnlyActiveShifts) {
            const now = new Date();
            return enrichedVehiclesForDay.filter((vehicle: EnrichedVehicleCalendarEntry) => {
                if (vehicle.statusInfo) return true;
                if (vehicle.isOnline) return true;
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
        return enrichedVehiclesForDay;
    }, [enrichedVehiclesForDay, showOnlyActiveShifts, today]);

    const vehiclesByShift = useMemo(() => {
        if (!displayedVehicles || displayedVehicles.length === 0) return {};
        return displayedVehicles.reduce((acc, vehicle) => {
            const shiftKey = vehicle.shiftName || "Sin Turno Asignado";
            if (!acc[shiftKey]) acc[shiftKey] = [];
            acc[shiftKey].push(vehicle);
            return acc;
        }, {} as Record<string, EnrichedVehicleCalendarEntry[]>);
    }, [displayedVehicles]);

    return { displayedVehicles, vehiclesByShift };
}

export function FleetCurrentShifts({ branches }: { branches: Branch[] }) {
    const today = useMemo(() => startOfToday(), []);
    const todayDateStr = useMemo(() => format(today, "yyyy-MM-dd"), [today]);

    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [showOnlyActiveShifts, setShowOnlyActiveShifts] = useState<boolean>(true);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);
    const { toast } = useToast()
    const summaryRef = useRef<HTMLDivElement>(null)

    const {
        calendarDaysData,
        isLoading: isLoadingPrimaryData,
        error: primaryDataError,
        refetchData: refetchPrimaryData,
    } = useVehicleCalendarData({
        currentDate: today,
        daysToShow: 1,
        branchId: selectedBranch
    });

    const {
        vehicleOnlineStatusData,
        isLoadingOnlineStatus,
        onlineStatusError: onlineHookError,
        fetchOnlineStatuses
    } = useVehicleOnlineStatus();

    useEffect(() => {
        if (primaryDataError && hasAttemptedFetch) {
            toast({
                variant: "destructive",
                title: "Error al cargar turnos",
                description: primaryDataError,
            })
        }
    }, [primaryDataError, toast, hasAttemptedFetch])

    useEffect(() => {
        if (onlineHookError) {
            toast({
                variant: "default",
                title: "Error al cargar estado online",
                description: onlineHookError,
            })
        }
    }, [onlineHookError, toast])

    useEffect(() => {
        if (calendarDaysData && calendarDaysData.length > 0 && hasAttemptedFetch) {
            const currentDaySummaryForOnline = calendarDaysData.find((s: CalendarDaySummary) => s.date === todayDateStr);
            if (currentDaySummaryForOnline) {
                const vehicleNumbersToFetch = currentDaySummaryForOnline.vehicles
                    .filter(v => !v.statusInfo)
                    .map(v => v.number);
                
                if (vehicleNumbersToFetch.length > 0) {
                    fetchOnlineStatuses(vehicleNumbersToFetch);
                }
            }
        }
    }, [calendarDaysData, fetchOnlineStatuses, todayDateStr, hasAttemptedFetch]);

    const currentBaseDaySummary = useMemo(() => {
        return calendarDaysData.find((s: CalendarDaySummary) => s.date === todayDateStr) || null
    }, [calendarDaysData, todayDateStr])

    const { displayedVehicles, vehiclesByShift } = useDerivedFleetData(
        currentBaseDaySummary,
        showOnlyActiveShifts,
        today,
        vehicleOnlineStatusData
    );

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
        await refetchPrimaryData();
    }, [selectedBranch, refetchPrimaryData, toast]);

    const handleScreenshot = async () => {
        if (!summaryRef.current || !currentBaseDaySummary) return
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

    const renderContent = () => {
        if (!selectedBranch) {
            return <Card className="p-6"><EmptyStateMessage message="Seleccione una sucursal y luego presione 'Ver Estado de Flota'." /></Card>;
        }

        const isLoading = (isLoadingPrimaryData || isLoadingOnlineStatus) && hasAttemptedFetch;

        if (isLoading) {
            return <LoadingIndicator />;
        }

        if (!hasAttemptedFetch) {
            return <Card className="p-6"><EmptyStateMessage message="Presione 'Ver Estado de Flota' para cargar los datos de la sucursal seleccionada." /></Card>;
        }
        
        if (!currentBaseDaySummary) {
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
                        isDownloadDisabled={!currentBaseDaySummary || displayedVehicles.length === 0}
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
                                isLoading={(isLoadingPrimaryData || isLoadingOnlineStatus) && hasAttemptedFetch}
                            />
                        </div>
                        <Button
                            onClick={handleFetchData} 
                            disabled={!selectedBranch || ((isLoadingPrimaryData || isLoadingOnlineStatus) && hasAttemptedFetch)} 
                            className="whitespace-nowrap"
                        >
                            <Search className="w-4 h-4" />
                            {(isLoadingPrimaryData && hasAttemptedFetch) ? "Cargando Turnos..." 
                             : (isLoadingOnlineStatus && hasAttemptedFetch) ? "Cargando Estados..." 
                             : "Ver Estado de Flota"}
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