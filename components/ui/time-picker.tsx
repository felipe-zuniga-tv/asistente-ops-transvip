'use client'

import { useState } from "react"
import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Control } from "react-hook-form"

interface TimePickerInputProps {
	control: Control<any>
	name: string
	label: string
}

export function TimePickerInput({
	control,
	name,
	label,
}: TimePickerInputProps) {
	const [openHours, setOpenHours] = useState(false)
	const [openMinutes, setOpenMinutes] = useState(false)

	const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
	const minutes = ['00', '15', '30', '45']

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				const [selectedHour, selectedMinute] = field.value ? field.value.split(':') : ['', '']
				
				return (
					<FormItem className="flex flex-col">
						<FormLabel>{label}</FormLabel>
						<div className="grid grid-cols-2 gap-2 w-full">
							<Popover open={openHours} onOpenChange={setOpenHours}>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											aria-expanded={openHours}
											className={cn(
												"w-full justify-between",
												!selectedHour ? "text-muted-foreground" : ""
											)}
										>
											{selectedHour ? `${selectedHour}` : "Hora"}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									<Command>
										<CommandInput placeholder="Hora..." className="h-9" />
										<CommandList>
											<CommandEmpty>Sin resultados</CommandEmpty>
											<CommandGroup>
												{hours.map((hour) => (
													<CommandItem
														key={hour}
														onSelect={() => {
															field.onChange(`${hour}:${selectedMinute || '00'}`)
															setOpenHours(false)
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																selectedHour === hour ? "opacity-100" : "opacity-0"
															)}
														/>
														{hour}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>

							<Popover open={openMinutes} onOpenChange={setOpenMinutes}>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											aria-expanded={openMinutes}
											className={cn(
												"w-full justify-between",
												!selectedMinute ? "text-muted-foreground" : ""
											)}
										>
											{selectedMinute ? `${selectedMinute}` : "Minutos"}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									<Command>
										<CommandInput placeholder="Minutos..." className="h-9" />
										<CommandList>
											<CommandEmpty>Sin resultados</CommandEmpty>
											<CommandGroup>
												{minutes.map((minute) => (
													<CommandItem
														key={minute}
														onSelect={() => {
															field.onChange(`${selectedHour || '00'}:${minute}`)
															setOpenMinutes(false)
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																selectedMinute === minute ? "opacity-100" : "opacity-0"
															)}
														/>
														{minute}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>
						<FormMessage />
					</FormItem>
				)
			}}
		/>
	)
} 