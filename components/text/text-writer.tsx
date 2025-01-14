'use client'

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TransvipLogo } from "@/components/transvip/transvip-logo"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { createText } from "@/lib/general/actions"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { ResetButton } from "../ui/buttons"
import { CopyWrapper } from "../ui/copy-wrapper"

export interface Option {
    value: string;
    label: string;
    disable?: boolean;
    /** fixed option that can&lsquo;t be removed. */
    fixed?: boolean;
    /** Group the options by providing key. */
    [key: string]: string | boolean | undefined;
}

interface GenTexts {
    subject: string
    content: string
}

interface FormData {
    objective: string
    fleetTypes: string[]
    vehicleTypes: string[]
    referenceText: string
    writingStyle: string
    variations: string
    generatedTexts: GenTexts[]
}

const INITIAL_FORM_DATA: FormData = {
    objective: '',
    fleetTypes: [],
    vehicleTypes: [],
    referenceText: '',
    writingStyle: '',
    variations: '1',
    generatedTexts: [],
}

const WRITING_STYLES = [
    { id: 'clear', label: 'Claro y conciso' },
    { id: 'formal', label: 'Formal' },
    { id: 'explanatory', label: 'Explicativo' },
]

const FLEET_OPTIONS: Option[] = [
    { label: 'Leasing', value: 'leasing' },
    { label: 'Freelance', value: 'freelance' },
]

const VEHICLE_TYPE_OPTIONS: Option[] = [
    { label: 'Sedan', value: 'Sedan' },
    { label: 'Minibus', value: 'Minibus' },
]

const VARIATIONS_OPTIONS = [
    { id: 1, label: '1 variación' },
    { id: 3, label: '3 variaciones' },
    { id: 5, label: '5 variaciones' },
]

export default function TextWriter() {
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
    const [isLoading, setIsLoading] = useState(false)

    const handleReset = () => {
        setFormData(INITIAL_FORM_DATA)
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const results = await createText({
                objective: formData.objective,
                fleetTypes: formData.fleetTypes,
                vehicleTypes: formData.vehicleTypes,
                referenceText: formData.referenceText,
                writingStyle: formData.writingStyle,
                variations: parseInt(formData.variations)
            })

            const generatedTexts = JSON.parse(results.text.replace('```json', '').replace('```', ''))
            console.log(generatedTexts)

            setFormData(prev => ({
                ...prev,
                generatedTexts: generatedTexts.texts
            }))
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="max-w-4xl lg:mx-auto">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row items-center gap-2">
                        <TransvipLogo size={20} />
                        <span>Escribe un texto</span>
                        <ResetButton handleReset={handleReset} />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                    <div className="space-y-2 w-full">
                        <label className="text-sm font-medium">Objetivo del texto</label>
                        <Textarea
                            value={formData.objective}
                            className="resize-none h-24 placeholder:text-sm text-sm"
                            onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                            placeholder="¿Cuál es el objetivo de lo que quiere comunicar?"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Tipo de Flota</Label>
                        <div className="flex flex-row gap-2 items-center">
                            {FLEET_OPTIONS.map((option) => (
                                <div
                                    key={option.value}
                                    className="flex items-center space-x-2 border rounded-md p-2 w-full"
                                >
                                    <Checkbox
                                        id={`fleet-${option.value}`}
                                        checked={formData.fleetTypes.includes(option.value)}
                                        onCheckedChange={(checked) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                fleetTypes: checked
                                                    ? [...prev.fleetTypes, option.value]
                                                    : prev.fleetTypes.filter(v => v !== option.value)
                                            }))
                                        }}
                                    />
                                    <Label
                                        htmlFor={`fleet-${option.value}`}
                                        className="text-sm font-medium cursor-pointer w-full"
                                    >
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Tipo de Vehículo</Label>
                        <div className="flex flex-row gap-2 items-center">
                            {VEHICLE_TYPE_OPTIONS.map((option) => (
                                <div
                                    key={option.value}
                                    className="flex items-center space-x-2 border rounded-md p-2 w-full"
                                >
                                    <Checkbox
                                        id={`fleet-${option.value}`}
                                        checked={formData.vehicleTypes.includes(option.value)}
                                        onCheckedChange={(checked) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                vehicleTypes: checked
                                                    ? [...prev.vehicleTypes, option.value]
                                                    : prev.vehicleTypes.filter(v => v !== option.value)
                                            }))
                                        }}
                                    />
                                    <Label
                                        htmlFor={`fleet-${option.value}`}
                                        className="text-sm font-medium cursor-pointer w-full"
                                    >
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Estilo de Escritura</Label>
                        <Select value={formData.writingStyle}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, writingStyle: value }))}>
                            <SelectTrigger className="text-slate-500">
                                <SelectValue placeholder="Seleccione un estilo" />
                            </SelectTrigger>
                            <SelectContent className="text-slate-700">
                                {WRITING_STYLES.map((style) => (
                                    <SelectItem key={style.id} value={style.id}>
                                        {style.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Número de Variaciones</Label>
                        <Select value={formData.variations}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, variations: value }))}>
                            <SelectTrigger className="text-slate-500">
                                <SelectValue placeholder="Seleccione cantidad" />
                            </SelectTrigger>
                            <SelectContent className="text-slate-700">
                                {VARIATIONS_OPTIONS.map((option) => (
                                    <SelectItem key={option.id} value={option.id.toString()}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Texto de Referencia</label>
                    <Textarea
                        value={formData.referenceText}
                        onChange={(e) => setFormData(prev => ({ ...prev, referenceText: e.target.value }))}
                        placeholder="Ingrese el texto de referencia, se usará como base"
                        className="resize-none h-32 placeholder:text-sm text-sm"
                    />
                </div>

                <div className="flex items-center justify-center">
                    <Button
                        className="w-fit px-24"
                        onClick={handleSubmit}
                        disabled={isLoading || !formData.objective}
                    >
                        {isLoading ? 'Generando texto...' : 'Generar texto'}
                    </Button>
                </div>

                {formData.generatedTexts.length > 0 && (
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-slate-700">Textos Generados</label>
                        <div className="space-y-2">
                            {formData.generatedTexts.map((text, index) => (
                                <Collapsible key={index} className="border rounded-md">
                                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-slate-50">
                                        <span className="text-sm font-medium">Variación {index + 1}</span>
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="p-4 pt-2">
                                        <div className="flex flex-col w-full gap-4 items-center">
                                            <Input readOnly value={text.subject} />
                                            <CopyWrapper content={text.subject + "\n\n" + text.content} className="w-full">
                                                <Textarea
                                                    value={text.content}
                                                    readOnly
                                                    className="resize-none h-48 bg-slate-50"
                                                />
                                            </CopyWrapper>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}