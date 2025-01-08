import { TicketResultType } from "@/app/(protected-apps)/finanzas/tickets/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, X } from "lucide-react";

export default function TicketResults({ results, handleClearResults, handleDownloadFile } : {
    results: TicketResultType[]
    handleClearResults: () => void
    handleDownloadFile: any
}) {
    if (results.length === 0) return

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <div className="flex flex-row items-center gap-6">
                        <span>Resultados</span>
                        {results.length > 0 && (
                            <Button onClick={handleDownloadFile} variant="outline" size={"sm"}>
                                <Download className="h-4 w-4" /> Descargar
                            </Button>
                        )}
                    </div>
                    {results.length > 0 && (
                        <Button variant="ghost"
                            size="icon"
                            onClick={handleClearResults}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2 items-start text-sm">
                    {results.map((result, index) => (
                        <div key={index} className="flex flex-col gap-2 items-start justify-start bg-gray-200 p-2 rounded-md w-full">
                            <div className="flex flex-row gap-2 items-center">
                                <span className="font-semibold">Reserva</span>
                                <span>{result.booking_id}</span>
                                <span>·</span>
                                <span className="font-semibold"># Boleta</span>
                                <span>{result.nro_boleta}</span>
                                <span>·</span>
                                <span className="font-semibold">Emisión Boleta</span>
                                <span>{result.date_issued} {result.time_issued}</span>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <span className="font-semibold">Entrada</span>
                                <span>{result.entry_date} {result.entry_time}</span>
                                <span>·</span>
                                <span className="font-semibold">Salida</span>
                                <span>{result.exit_date} {result.exit_time}</span>
                                <span>·</span>
                                <span className="font-semibold">Valor</span>
                                <span>{result.valor}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}