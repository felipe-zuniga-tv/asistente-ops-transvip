'use client'

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { RotateCw } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export interface Option {
    value: string;
    label: string;
    disable?: boolean;
    /** fixed option that can&lsquo;t be removed. */
    fixed?: boolean;
    /** Group the options by providing key. */
    [key: string]: string | boolean | undefined;
  }

interface FormData {
    title: string
    fleetTypes: string[]
    vehicleTypes: string[]
    referenceText: string
    writingStyle: string
}

const INITIAL_FORM_DATA: FormData = {
    title: '',
    fleetTypes: [],
    vehicleTypes: [],
    referenceText: '',
    writingStyle: '',
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

export default function TextWriter() {
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
    const [isLoading, setIsLoading] = useState(false)

    const handleReset = () => {
        setFormData(INITIAL_FORM_DATA)
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            // Server action call will go here
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="max-w-4xl mx-2 mt-4 lg:mx-auto">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row items-center gap-2">
                        <TransvipLogo size={20} />
                        <span>Escribe un texto</span>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleReset}
                            className="ml-auto"
                        >
                            <RotateCw className="w-4 h-4 mr-1" />
                            Reiniciar
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                    <div className="space-y-2 w-full lg:w-2/3">
                        <label className="text-sm font-medium">Título</label>
                        <Input
                            value={formData.title}
                            className="w-full"
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Ingrese el título del texto"
                        />
                    </div>
                    <div className="space-y-2 w-full lg:w-1/3">
                        <label className="text-sm font-medium">Estilo de Escritura</label>
                        <Select
                            value={formData.writingStyle}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, writingStyle: value }))}
                        >
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                    <div className="space-y-2 w-full">
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
                                        className="text-sm font-medium cursor-pointer"
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
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Texto de Referencia</label>
                    <Textarea
                        value={formData.referenceText}
                        onChange={(e) => setFormData(prev => ({ ...prev, referenceText: e.target.value }))}
                        placeholder="Ingrese el texto de referencia"
                        className="resize-none h-32 placeholder:text-sm"
                    />
                </div>

                <Button className="w-full mt-4" onClick={handleSubmit} disabled={isLoading}
                >
                    {isLoading ? 'Generando texto...' : 'Generar texto'}
                </Button>
            </CardContent>
        </Card>
    )
}