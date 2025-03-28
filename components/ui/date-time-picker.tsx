"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"
import { Control } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface DateTimePickerProps {
	control: Control<any>
	name: string
	label: string
	placeholder?: string
	disabled?: boolean
}

export function DateTimePicker({ control, name, label, placeholder = "Seleccionar fecha y hora", disabled }: DateTimePickerProps) {
	// Generate hours (00-23)
	const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))

	// Generate minutes (00, 15, 30, 45)
	const minutes = ["00", "15", "30", "45"]

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				const date = field.value ? new Date(field.value) : undefined
				const hour = date ? date.getHours().toString().padStart(2, "0") : "00"
				const minute = date ? (Math.floor(date.getMinutes() / 15) * 15).toString().padStart(2, "0") : "00"

				const handleDateSelect = (newDate: Date | undefined) => {
					if (!newDate) {
						field.onChange(undefined)
						return
					}

					const currentDate = field.value ? new Date(field.value) : new Date()
					newDate.setHours(currentDate.getHours())
					newDate.setMinutes(currentDate.getMinutes())
					field.onChange(newDate)
				}

				const handleHourChange = (newHour: string) => {
					if (!field.value) {
						const now = new Date()
						now.setHours(parseInt(newHour))
						now.setMinutes(parseInt(minute))
						field.onChange(now)
						return
					}

					const newDate = new Date(field.value)
					newDate.setHours(parseInt(newHour))
					field.onChange(newDate)
				}

				const handleMinuteChange = (newMinute: string) => {
					if (!field.value) {
						const now = new Date()
						now.setHours(parseInt(hour))
						now.setMinutes(parseInt(newMinute))
						field.onChange(now)
						return
					}

					const newDate = new Date(field.value)
					newDate.setMinutes(parseInt(newMinute))
					field.onChange(newDate)
				}

				return (
					<FormItem className="space-y-0 flex flex-col gap-2">
						<FormLabel>{ label }</FormLabel>
						<Popover>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant={"outline"}
										className={cn(
											"w-full justify-start text-left font-normal",
											!field.value && "text-muted-foreground"
										)}
										disabled={disabled}
									>
										<div className="flex items-center gap-2">
											<CalendarIcon className="h-4 w-4" />
											{field.value ? (
												format(field.value, "PPP p", { locale: es })
											) : (
												<span>{placeholder}</span>
											)}
										</div>
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0 flex" align="start">
								<div>
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={handleDateSelect}
										disabled={(date) =>
											date < new Date() || date < new Date("1900-01-01")
										}
										initialFocus
										locale={es}
									/>
								</div>
								<Separator orientation="vertical" className="h-auto" />
								<div className="p-4 flex flex-col justify-center min-w-[180px]">
									<div className="flex items-center mb-4">
										<Clock className="mr-2 h-4 w-4" />
										<span className="text-sm font-medium">Seleccionar hora</span>
									</div>
									<div className="space-y-4">
										<div className="grid gap-1">
											<label htmlFor="hour" className="text-xs">
												Hora
											</label>
											<Select value={hour} onValueChange={handleHourChange}>
												<SelectTrigger id="hour">
													<SelectValue placeholder="Hora" />
												</SelectTrigger>
												<SelectContent>
													{hours.map((h) => (
														<SelectItem key={h} value={h}>
															{h}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className="grid gap-1">
											<label htmlFor="minute" className="text-xs">
												Minuto
											</label>
											<Select value={minute} onValueChange={handleMinuteChange}>
												<SelectTrigger id="minute">
													<SelectValue placeholder="Minuto" />
												</SelectTrigger>
												<SelectContent>
													{minutes.map((m) => (
														<SelectItem key={m} value={m}>
															{m}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
								</div>
							</PopoverContent>
						</Popover>
						<FormMessage />
					</FormItem>
				)
			}}
		/>
	)
} 