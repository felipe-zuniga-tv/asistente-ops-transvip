import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command"
import { Vehicle } from "@/lib/airport/types"
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Popover } from "@radix-ui/react-popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface VehicleDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function VehicleDialog({ isOpen, onClose }: VehicleDialogProps) {
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            fetchVehicles()
        } else {
            // Reset states when dialog is closed
            setVehicles([])
            setValue("")
            setIsLoading(false)
            setOpen(false)
        }
    }, [isOpen])

    const fetchVehicles = async () => {
        setIsLoading(true)
        const response = await fetch(`/api/airport/zarpe/vehicles/get-vehicle-list?airportCode=SCL`)
        const data = await response.json()
        setVehicles(data)
        setIsLoading(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="mb-4">
                    <DialogTitle>Agregar vehículo al andén</DialogTitle>
                </DialogHeader>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {value
                                ? vehicles.find((vehicle) => vehicle.license_plate === value)?.license_plate
                                : "Busca el móvil aquí..."}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput 
                                placeholder="Busca el móvil..." 
                                className="h-9" 
                                value={value}
                                onValueChange={setValue}
                            />
                            <CommandList>
                                {isLoading ? (
                                    <CommandEmpty>Cargando vehículos...</CommandEmpty>
                                ) : (
                                    <>
                                        <CommandEmpty>No hay vehículos.</CommandEmpty>
                                        <CommandGroup className="w-full">
                                            {vehicles.map((vehicle, index) => (
                                                <CommandItem
                                                    key={vehicle.license_plate}
                                                    value={vehicle.vehicle_number}
                                                    onSelect={(currentValue) => {
                                                        setValue(currentValue === value ? "" : currentValue)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    {index + 1} | Patente: {vehicle.license_plate} · # Móvil: {vehicle.vehicle_number}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            value === vehicle.license_plate ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </DialogContent>
        </Dialog>
    )
}