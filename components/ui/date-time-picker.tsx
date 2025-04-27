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
	hourPlaceholder?: string
	minutePlaceholder?: string
	disabled?: boolean
	id?: string
	mode?: 'date' | 'time' | 'datetime'
}

export function DateTimePicker({
	value,
	onChange,
	label,
	placeholder,
	hourPlaceholder,
	minutePlaceholder,
	disabled,
	id,
	mode = 'datetime'
}: DateTimePickerProps) {
	const showCalendar = mode === 'date' || mode === 'datetime';
	const showTime = mode === 'time' || mode === 'datetime';

	let defaultPlaceholder = "Seleccionar";
	if (showCalendar && showTime) defaultPlaceholder = "Seleccionar fecha y hora";
	else if (showCalendar) defaultPlaceholder = "Seleccionar fecha";
	else if (showTime) defaultPlaceholder = "Seleccionar hora";
	const finalPlaceholder = placeholder ?? defaultPlaceholder;

	let formatString = "";
	if (showCalendar && showTime) formatString = "PPP p";
	else if (showCalendar) formatString = "PPP";
	else if (showTime) formatString = "p";

	const IconComponent = showTime && !showCalendar ? Clock : CalendarIcon;

	const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
	const minutes = ["00", "15", "30", "45"]

	const date = value ? new Date(value) : undefined
	const hour = date ? date.getHours().toString().padStart(2, "0") : "00"
	const minute = date ? (Math.floor(date.getMinutes() / 15) * 15).toString().padStart(2, "0") : "00"

	const handleDateSelect = (newDate: Date | undefined) => {
		if (!newDate) {
			if (mode === 'date') {
				onChange(undefined);
			}
			return
		}

		const currentDate = value ? new Date(value) : new Date()
		if (showTime) {
			newDate.setHours(currentDate.getHours())
			newDate.setMinutes(currentDate.getMinutes())
		} else {
			newDate.setHours(0, 0, 0, 0);
		}
		onChange(newDate)
	}

	const handleHourChange = (newHour: string) => {
		let targetDate: Date;
		if (!value) {
			targetDate = new Date();
			targetDate.setMinutes(parseInt(minute))
			targetDate.setSeconds(0, 0);
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
			targetDate.setSeconds(0, 0);
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
							<IconComponent className="h-4 w-4" />
							{value && formatString ? (
								format(value, formatString, { locale: es })
							) : (
								<span>{finalPlaceholder}</span>
							)}
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0 flex" align="start">
					{showCalendar && (
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
					)}
					{showCalendar && showTime && (
						<Separator orientation="vertical" className="h-auto" />
					)}
					{showTime && (
						<div className={cn("p-4 flex flex-col justify-center min-w-[180px]", !showCalendar && "w-full")}>
							{showCalendar && (
								<div className="flex items-center mb-4">
									<Clock className="mr-2 h-4 w-4" />
									<span className="text-sm font-medium">{finalPlaceholder}</span>
								</div>
							)}
							<div className="flex flex-row justify-between gap-2 min-w-[180px] w-full">
								<div className="grid gap-1 flex-1">
									<label htmlFor={`${id}-hour`} className="text-xs">
										{hourPlaceholder}
									</label>
									<Select value={hour} onValueChange={handleHourChange} disabled={disabled}>
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
								<div className="grid gap-1 flex-1">
									<label htmlFor={`${id}-minute`} className="text-xs">
										{minutePlaceholder}
									</label>
									<Select value={minute} onValueChange={handleMinuteChange} disabled={disabled}>
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
					)}
				</PopoverContent>
			</Popover>
		</div>
	)
} 