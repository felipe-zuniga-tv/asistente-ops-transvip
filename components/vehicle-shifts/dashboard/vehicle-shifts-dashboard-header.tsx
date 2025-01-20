import { Input } from "@/components/ui/input"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Search, X } from "lucide-react"
import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface VehicleShiftsDashboardHeaderProps {
    vehicleNumber: string
    onVehicleNumberChange: (value: string) => void
    onSearch: () => void
    isLoading: boolean
    daysToShow: number
    onDaysToShowChange: (days: number) => void
}

const daysOptions = [30, 60, 90, 120]

export function VehicleShiftsDashboardHeader({
    vehicleNumber,
    onVehicleNumberChange,
    onSearch,
    isLoading,
    daysToShow,
    onDaysToShowChange
}: VehicleShiftsDashboardHeaderProps) {
    return (
        <CardHeader>
            <CardTitle className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2">
                        <TransvipLogo size={20} />
                        <span className="text-sm sm:text-base">Calendario de Turnos</span>
                    </div>
                    <div className="ml-auto flex flex-row items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">Mostrar:</span>
                        <Select value={daysToShow.toString()}
                            onValueChange={(value) => onDaysToShowChange(parseInt(value))}
                        >
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Días" />
                            </SelectTrigger>
                            <SelectContent>
                                {daysOptions.map((days) => (
                                    <SelectItem key={days} value={days.toString()} className="font-normal">
                                        {days} días
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="flex justify-start items-center gap-2">
                        <div className="relative">
                            <Input
                                id="vehicle_number"
                                type="number"
                                placeholder="Ingrese número de móvil"
                                value={vehicleNumber}
                                onChange={(e) => onVehicleNumberChange(e.target.value)}
                                className={cn(
                                    "w-[260px] peer ps-9 pe-9",
                                    "font-normal placeholder:text-muted-foreground placeholder:text-sm placeholder:font-normal"
                                )}
                            />
                            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
                                <Search className="h-4 w-4" />
                            </div>
                            {(vehicleNumber || isLoading) && (
                                <div className="absolute inset-y-0 end-0 flex items-center pe-3">
                                    {vehicleNumber && !isLoading && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => onVehicleNumberChange("")}
                                            className="h-8 w-8 p-0 hover:bg-transparent"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {isLoading && (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={onSearch}
                            disabled={!vehicleNumber || isLoading}
                            className="whitespace-nowrap"
                        >
                            Buscar
                        </Button>
                    </div>
                </div>
            </CardTitle>
        </CardHeader>
    )
} 