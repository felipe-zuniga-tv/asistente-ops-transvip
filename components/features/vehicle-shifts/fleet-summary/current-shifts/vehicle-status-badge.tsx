'use client'

import { Badge } from "@/components/ui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from '@/utils/ui'
import type { VehicleCalendarEntry } from "@/types/domain/calendar/types"
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface VehicleStatusBadgeProps {
  vehicle: VehicleCalendarEntry;
}

export function VehicleStatusBadge({ vehicle }: VehicleStatusBadgeProps) {

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant={"secondary"}
          className={cn(
            "justify-center py-1.5 flex items-center gap-2 text-xs mr-1 mb-1 cursor-default w-20",
            vehicle.statusInfo ? `bg-yellow-100 hover:bg-yellow-100/80 border border-yellow-200 text-black hover:brightness-90`
              : "bg-gray-100 text-black hover:bg-gray-200"
          )}
        >
          <span className={cn("h-2 w-2 rounded-full",
            vehicle.isOnline === true ? "bg-green-500" :
              vehicle.isOnline === false ? "bg-red-500" :
                "bg-gray-300"
          )}
          />
          {vehicle.number}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {vehicle.statusInfo && vehicle.statusInfo.label ? (
          <span>{vehicle.statusInfo.label}</span>
        ) : vehicle.isOnline !== undefined && vehicle.lastOnlineStatusUpdate ? (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs font-medium">{vehicle.isOnline ? "En línea" : "Fuera de línea"}</span>
            <span className="text-xs text-white">
              (Actualizado hace {formatDistanceToNow(new Date(vehicle.lastOnlineStatusUpdate), { addSuffix: false, locale: es })})
            </span>
          </div>
        ) : vehicle.isOnline !== undefined ? (
           <span>{vehicle.isOnline ? "En línea" : "Fuera de línea"} (actual)</span>
        ) : (
          <span>Estado online desconocido</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
} 