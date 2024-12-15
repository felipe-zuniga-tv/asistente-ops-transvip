'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Textarea from 'react-textarea-autosize'
import { Map } from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Define the options for the dropdown
const timeOptions = [
    { value: 30, label: "30 minutos" },
    { value: 60, label: "60 minutos" },
    { value: 90, label: "90 minutos" },
    { value: 100000, label: "Sin Límite" },
];

const routingTypes = [
    { value: 'zarpe', label: "Ruteo tipo Zarpe (uno a muchos)" },
    { value: 'preasignaciones', label: "Ruteo Preasignaciones" },
];

const RoutingComponent: React.FC = () => {
    const [bookings, setBookings] = useState<string[]>([]);
    const [vehicles, setVehicles] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [selectedRoutingType, setSelectedRoutingType] = useState<string>("");
    const isButtonDisabled = bookings.length === 0 || vehicles.length === 0 || !selectedRoutingType;

    const handleRouteCreation = async () => {
        const response = await fetch('/api/routes/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookings: bookings.join(','),
                vehicles: vehicles.join(','),
            }),
        });
        const data = await response.json()

        // Handle response as needed
        console.log(data);
    };

    return (
        <div className='p-8 flex flex-col gap-4 w-full max-w-4xl mx-auto'>
            <div className='flex flex-row justify-between items-center'>
                <span className='font-bold text-xl'>Ruteo de Reservas</span>
            </div>
            <Card className="w-full max-w-4xl mx-auto p-4 bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle className='text-lg'>Inputs</CardTitle>
                    <CardDescription>Ingresa los números de reserva, los números de móvil y los parámetros de ruteo</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-4'>
                    <div className='flex flex-row gap-4 items-center justify-start'>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[300px] justify-between">
                                    {selectedRoutingType ? routingTypes.find(option => option.value === selectedRoutingType)?.label : "Tipo de Ruteo"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput placeholder="Buscar tipo de ruteo..." />
                                    <CommandList>
                                        <CommandEmpty>No se encontró tipo de ruteo.</CommandEmpty>
                                        <CommandGroup>
                                            {routingTypes.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    value={option.value}
                                                    onSelect={(currentValue) => {
                                                        setSelectedRoutingType(currentValue === selectedRoutingType ? "" : currentValue);
                                                    }}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", selectedRoutingType === option.value ? "opacity-100" : "opacity-0")} />
                                                    {option.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Textarea
                        placeholder="Reservas"
                        value={bookings.join(', ')}
                        onChange={(e) => setBookings(e.target.value.split(',').map(item => item.trim()))}
                        className="border p-2 rounded-md"
                    />
                    <Textarea
                        placeholder="Vehículos"
                        value={vehicles.join(', ')}
                        onChange={(e) => setVehicles(e.target.value.split(',').map(item => item.trim()))}
                        className="border p-2 rounded-md"
                    />
                    <div className='flex flex-row gap-4 items-center justify-start'>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[300px] justify-between">
                                    {selectedTime ? timeOptions.find(option => option.value === Number(selectedTime))?.label : "Tiempo máximo de ruta..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput placeholder="Buscar tiempo..." />
                                    <CommandList>
                                        <CommandEmpty>No se encontró tiempo.</CommandEmpty>
                                        <CommandGroup>
                                            {timeOptions.map((option) => (
                                                <CommandItem
                                                    key={String(option.value)}
                                                    value={String(option.value)}
                                                    onSelect={(currentValue) => {
                                                        setSelectedTime(currentValue === selectedTime ? "" : currentValue);
                                                    }}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", selectedTime === String(option.value) ? "opacity-100" : "opacity-0")} />
                                                    {option.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        variant={"default"}
                        onClick={handleRouteCreation}
                        disabled={isButtonDisabled}
                        className={`p-2 px-6 ${isButtonDisabled ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                    >
                        <Map /> Armar Rutas
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RoutingComponent;
