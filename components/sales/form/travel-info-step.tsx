'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Calendar,
	Popover,
	PopoverContent,
	PopoverTrigger,
	TimePickerInput,
	PhoneNumberInput
} from '@/components/ui'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Loader2, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils/ui'
import { es } from 'date-fns/locale'
import type { Country } from 'react-phone-number-input'
import * as RPNInput from "react-phone-number-input"

interface TravelInfoStepProps {
	data: {
		phoneNumber: string
		countryCode?: string
		returnDate: Date | null
		returnTime: string
	}
	onChange: (data: {
		phoneNumber: string
		countryCode?: string
		returnDate: Date | null
		returnTime: string
	}) => void
	onNext: () => void
	onBack: () => void
	translations: {
		title: string
		description: string
		phoneNumber: string
		countryCode: string
		returnDate: string
		returnTime: string
		selectDate: string
		selectCountry: string
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
	const [selectedCountry, setSelectedCountry] = useState<Country | undefined>()

	const formSchema = z.object({
		countryData: z.object({
			country: z.string().optional(),
			countryCode: z.string().optional()
		}).optional(),
		phoneNumber: z.string().min(1, {
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
			countryData: data.countryCode ? { countryCode: data.countryCode } : undefined,
			phoneNumber: data.phoneNumber,
			returnDate: data.returnDate || undefined,
			returnTime: data.returnTime,
		},
		mode: "onChange"
	})

	// Extract country from country code when component mounts
	useEffect(() => {
		if (data.countryCode) {
			const countryFromCode = RPNInput.getCountries().find(
				country => `+${RPNInput.getCountryCallingCode(country)}` === data.countryCode
			)
			if (countryFromCode) {
				setSelectedCountry(countryFromCode)
			}
		}
	}, [data.countryCode])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsSubmitting(true)
			
			// Get the country code from the form data
			const countryCode = values.countryData?.countryCode
			
			// Custom validation logic for phone numbers with country codes
			if (countryCode) {
				// If country code exists, phone number can be shorter
				if (values.phoneNumber.length < 1) {
					form.setError("phoneNumber", { 
						message: translations.validation.phoneNumber 
					});
					setIsSubmitting(false);
					return;
				}
			} else {
				// Without country code, enforce minimum length of 6
				if (values.phoneNumber.length < 6) {
					form.setError("phoneNumber", { 
						message: translations.validation.phoneNumber 
					});
					setIsSubmitting(false);
					return;
				}
			}
			
			onChange({
				phoneNumber: values.phoneNumber,
				countryCode: values.countryData?.countryCode,
				returnDate: values.returnDate,
				returnTime: values.returnTime
			})
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
						<div className="flex flex-row gap-1">
							<FormField
								control={form.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>{translations.countryCode}</FormLabel>
										<FormControl>
											<PhoneNumberInput
												value={{ phoneNumber: field.value, countryCode: data.countryCode }}
												onChange={(value) => {
													// Update the phone number field
													field.onChange(value.phoneNumber)

													// If you need to update the country code in the parent state
													if (value.countryCode !== data.countryCode) {
														form.setValue('countryData.countryCode', value.countryCode)
													}
												}}
												placeholder="123456789"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
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

					<div className="flex justify-between gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onBack}
							disabled={isSubmitting}
							className="w-1/3 sm:w-1/4 bg-transvip hover:bg-transvip-dark h-10 text-white hover:text-white"
						>
							<ArrowLeftIcon className="w-4 h-4" /> {translations.back}
						</Button>
						<Button type="submit" className="w-1/2 h-10" disabled={isSubmitting}>
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