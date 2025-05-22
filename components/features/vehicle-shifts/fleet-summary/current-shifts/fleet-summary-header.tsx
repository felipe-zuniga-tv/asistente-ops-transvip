'use client'

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Download } from "lucide-react"
import { Button } from "@/components/ui"

interface FleetSummaryHeaderProps {
  currentDate: Date;
  displayedVehiclesCount: number;
  onDownload: () => void;
  isDownloadDisabled: boolean;
}

export function FleetSummaryHeader({
  currentDate,
  displayedVehiclesCount,
  onDownload,
  isDownloadDisabled,
}: FleetSummaryHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <h3 className="text-lg font-semibold">
            Fecha: {format(currentDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
          </h3>
          {displayedVehiclesCount > 0 && (
            <>
              <span>·</span>
              <span className="text-base text-muted-foreground">
                {displayedVehiclesCount} vehículo{displayedVehiclesCount === 1 ? '' : 's'}
              </span>
            </>
          )}
        </div>
        <div className="text-sm text-slate-500">
          <span className="font-semibold">Actualizado:</span> {format(new Date(), 'EEEE, d MMMM yyyy HH:mm', { locale: es })}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 ml-auto">
        <Button
          variant="default"
          size="sm"
          onClick={onDownload}
          className="gap-2 bg-transvip text-white hover:bg-transvip/90"
          disabled={isDownloadDisabled}
        >
          <Download className="h-4 w-4" />
          <span>Descargar Resumen</span>
        </Button>
      </div>
    </div>
  );
} 