'use client'

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { invertCoordinatesGeoJson } from "@/lib/services/general"
import { TransvipLogo } from "@/components/features/transvip/transvip-logo"
import { CopyWrapper } from "@/components/ui/copy-wrapper"
import { ResetButton } from "@/components/ui/buttons"

export default function CoordinatesInversion() {
    const [inputValue, setInputValue] = useState<string>("")
    const [outputValue, setOutputValue] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
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

    return (
        <Card className="max-w-4xl lg:mx-auto">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row items-center gap-2">
                        <TransvipLogo size={20} />
                        <span>Invertir coordenadas GeoJSON</span>
                        <ResetButton handleReset={handleReset} />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 items-center">
                <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Código de entrada"
                    className="w-full h-[160px] p-2 border font-mono text-sm resize-none"
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

                {outputValue && (
                    <CopyWrapper content={outputValue} className="w-full">
                        <Textarea
                            value={outputValue}
                            readOnly
                            placeholder="Resultados"
                            className="w-full h-[160px] p-2 pr-12 border font-mono text-sm resize-none"
                        />
                    </CopyWrapper>
                )}
            </CardContent>
        </Card>
    )
}