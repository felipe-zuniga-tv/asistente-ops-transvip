"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/utils/ui"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

interface DateTimePickerProps {
	value: Date | null | undefined
	onChange: (date: Date | undefined) => void
	label: string
	placeholder?: string
	disabled?: boolean
	id?: string
}

export function DateTimePicker({
	value,
	onChange,
	label,
	placeholder = "Seleccionar fecha y hora",
	disabled,
	id
}: DateTimePickerProps) {
	const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
	const minutes = ["00", "15", "30", "45"]

	const date = value ? new Date(value) : undefined
	const hour = date ? date.getHours().toString().padStart(2, "0") : "00"
	const minute = date ? (Math.floor(date.getMinutes() / 15) * 15).toString().padStart(2, "0") : "00"

	const handleDateSelect = (newDate: Date | undefined) => {
		if (!newDate) {
			onChange(undefined)
			return
		}

		const currentDate = value ? new Date(value) : new Date()
		newDate.setHours(currentDate.getHours())
		newDate.setMinutes(currentDate.getMinutes())
		onChange(newDate)
	}

	const handleHourChange = (newHour: string) => {
		let targetDate: Date;
		if (!value) {
			targetDate = new Date();
			targetDate.setMinutes(parseInt(minute))
		} else {
			targetDate = new Date(value)
		}
		targetDate.setHours(parseInt(newHour))
		onChange(targetDate)
	}

	const handleMinuteChange = (newMinute: string) => {
		let targetDate: Date;
		if (!value) {
			targetDate = new Date();
			targetDate.setHours(parseInt(hour))
		} else {
			targetDate = new Date(value)
		}
		targetDate.setMinutes(parseInt(newMinute))
		onChange(targetDate)
	}

	return (
		<div className="space-y-0 flex flex-col gap-2">
			<Label htmlFor={id}>{ label }</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id={id}
						variant={"outline"}
						className={cn(
							"w-full justify-start text-left font-normal",
							!value && "text-muted-foreground"
						)}
						disabled={disabled}
					>
						<div className="flex items-center gap-2">
							<CalendarIcon className="h-4 w-4" />
							{value ? (
								format(value, "PPP p", { locale: es })
							) : (
								<span>{placeholder}</span>
							)}
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0 flex" align="start">
					<div>
						<Calendar
							mode="single"
							selected={value ?? undefined}
							onSelect={handleDateSelect}
							disabled={(date) =>
								date < new Date(new Date().setHours(0, 0, 0, 0))
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
								<label htmlFor={`${id}-hour`} className="text-xs">
									Hora
								</label>
								<Select value={hour} onValueChange={handleHourChange}>
									<SelectTrigger id={`${id}-hour`}>
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
								<label htmlFor={`${id}-minute`} className="text-xs">
									Minuto
								</label>
								<Select value={minute} onValueChange={handleMinuteChange}>
									<SelectTrigger id={`${id}-minute`}>
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
		</div>
	)
} 