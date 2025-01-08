'use client'

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { invertCoordinatesGeoJson } from "@/lib/general/functions"
import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { CheckIcon, ClipboardIcon, RotateCw } from "lucide-react"
import useClipboard from "@/hooks/use-copy-to-clipboard"
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function CoordinatesInversion() {
    const [inputValue, setInputValue] = useState<string>("")
    const [outputValue, setOutputValue] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { copyToClipboard, isCopied, error } = useClipboard();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function handleProcessInput() {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const processedResult = invertCoordinatesGeoJson(inputValue);
            setOutputValue(JSON.stringify(processedResult));
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : 'Error al procesar las coordenadas');
            setOutputValue('');
        } finally {
            setIsLoading(false);
        }
    }

    function handleReset() {
        setInputValue("");
        setOutputValue("");
        setIsLoading(false);
    }
    function handleCopy() {
        copyToClipboard(outputValue);
    }

    return (
        <Card className="max-w-4xl mx-auto mt-4">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row items-center gap-2">
                        <TransvipLogo size={20} />
                        <span>Invertir coordenadas GeoJSON</span>
                        <Button variant={"default"} size={"sm"} onClick={handleReset} className="ml-auto">
                            <RotateCw className="w-4 h-4" />
                            Comenzar de nuevo
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 items-center">
                <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Código de entrada"
                    className="w-full h-[160px] p-2 border rounded font-mono text-sm"
                />
                {errorMessage && (
                    <p className="text-center text-sm text-red-500 w-full">Error: {errorMessage}</p>
                )}
                <Button variant={"default"} onClick={handleProcessInput}
                    className="mt-2 p-2 px-4 text-white rounded"
                    disabled={isLoading || !inputValue}
                >
                    {isLoading ? 'Procesando...' : 'Procesar coordenadas'}
                </Button>
                <div className="relative w-full">
                    <Textarea
                        value={outputValue}
                        readOnly
                        placeholder="Resultados"
                        className="w-full h-[160px] p-2 pr-12 border rounded font-mono text-sm"
                    />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant={"default"} size={"icon"} onClick={handleCopy} className="absolute top-3 right-3 bg-slate-600 hover:bg-slate-500 w-8 h-8">
                                    {isCopied ? <CheckIcon className="w-3 h-3" /> : <ClipboardIcon className="w-3 h-3" /> }
                                </Button>
                            </TooltipTrigger>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    )
}