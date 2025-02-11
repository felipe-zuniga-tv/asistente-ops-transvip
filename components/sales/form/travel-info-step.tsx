'use client'

import {useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Check, ChevronsUpDown, Loader2, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { es } from 'date-fns/locale'
import { countryCodes } from '@/lib/config/country-codes'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import * as React from "react"
import { TimePickerInput } from '@/components/ui/time-picker'
import { PhoneNumberInput } from '@/components/ui/phone-number-input'

interface TravelInfoStepProps {
	data: {
		phoneNumber: string
		returnDate: Date | null
		returnTime: string
	}
	onChange: (data: {
		phoneNumber: string
		returnDate: Date | null
		returnTime: string
	}) => void
	onNext: () => void
	onBack: () => void
	translations: {
		title: string
		description: string
		phoneNumber: string
		returnDate: string
		returnTime: string
		selectDate: string
		continue: string
		back: string
		validation: {
			phoneNumber: string
			returnDate: string
			returnTime: string
		}
	}
}

export function TravelInfoStep({
	data,
	onChange,
	onNext,
	onBack,
	translations
}: TravelInfoStepProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)

	const formSchema = z.object({
		phoneNumber: z.string().min(6, {
			message: translations.validation.phoneNumber,
		}),
		returnDate: z.date({
			required_error: translations.validation.returnDate,
		}),
		returnTime: z.string().min(1, {
			message: translations.validation.returnTime,
		}),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			phoneNumber: data.phoneNumber,
			returnDate: data.returnDate || undefined,
			returnTime: data.returnTime,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsSubmitting(true)
			onChange(values)
			onNext()
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold text-center">{translations.title}</h2>
				<p className="text-muted-foreground text-center">
					{translations.description}
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-4">
						<FormItem className="space-y-1">
							<FormLabel>{translations.phoneNumber}</FormLabel>
							<FormField
								control={form.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormControl>
										<PhoneNumberInput
											id={field.name}
											value={field.value}
											onChange={field.onChange}
											placeholder="123456789"
										/>
									</FormControl>
								)}
							/>
							<FormMessage />
						</FormItem>
					</div>

					<FormField
						control={form.control}
						name="returnDate"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>{translations.returnDate}</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												className={cn(
													'w-full pl-3 text-left font-normal',
													!field.value ? 'text-muted-foreground' : ''
												)}
											>
												{field.value ? (
													format(field.value, 'PPP', { locale: es })
												) : (
													<span>{translations.selectDate}</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) =>
												date < new Date() || date < new Date('1900-01-01')
											}
											initialFocus
											locale={es}
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<TimePickerInput
						control={form.control}
						name="returnTime"
						label={translations.returnTime}
					/>

					<div className="flex gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onBack}
							disabled={isSubmitting}
							className="w-full bg-transvip hover:bg-transvip-dark h-10 text-white hover:text-white"
						>
							<ArrowLeftIcon className="w-4 h-4" /> {translations.back}
						</Button>
						<Button type="submit" className="w-full h-10" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{translations.continue}
								</>
							) : (
								<>
									{translations.continue} <ArrowRightIcon className="ml-2 w-4 h-4" />
								</>
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
} 