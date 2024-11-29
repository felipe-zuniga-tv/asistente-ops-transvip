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

// Define the options for the dropdown
const timeOptions = [
  { value: 30, label: "30 minutos" },
  { value: 60, label: "60 minutos" },
  { value: 90, label: "90 minutos" },
  { value: 100000, label: "Sin Límite" },
];

const RoutingComponent: React.FC = () => {
    const [bookings, setBookings] = useState<string>('');
    const [vehicles, setVehicles] = useState<string>('');
    const isButtonDisabled = !bookings || !vehicles;
    const [selectedTime, setSelectedTime] = useState<string>("");

    const handleRouteCreation = async () => {
        const response = await fetch('/api/routes/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookings,
                vehicles,
            }),
        });
        const data = await response.json()
        // Handle response as needed
        console.log(data);
        
    };

    return (
        <div className='p-8 flex flex-col gap-4'>
            <div className='flex flex-row justify-between items-center'>
                <span className='font-bold text-xl'>Ruteo de Reservas</span>
                <Button
                    variant={"default"}
                    onClick={handleRouteCreation}
                    disabled={isButtonDisabled}
                    className={`p-2 ${isButtonDisabled ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                >
                    <Map /> Armar Rutas
                </Button>
            </div>
            <div className='flex flex-row gap-4 items-center justify-start'>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[300px] justify-between">
                            {selectedTime ? timeOptions.find(option => option.value === Number(selectedTime))?.label : "Tiempo máximo de ruta.."}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Textarea
                    placeholder="Reservas"
                    value={bookings}
                    onChange={(e) => setBookings(e.target.value)}
                    className="border p-2 rounded-md"
                />
                <Textarea
                    placeholder="Vehículos"
                    value={vehicles}
                    onChange={(e) => setVehicles(e.target.value)}
                    className="border p-2 rounded-md"
                />
            </div>
        </div>
    );
};

export default RoutingComponent;
