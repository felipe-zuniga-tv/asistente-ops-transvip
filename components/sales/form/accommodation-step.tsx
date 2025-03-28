'use client'

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
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

interface AccommodationStepProps {
	value: string
	onChange: (value: string) => void
	onNext: () => void
	onBack: () => void
	translations: {
		title: string
		description: string
		name: string
		placeholder: string
		continue: string
		back: string
		validation: {
			name: string
		}
	}
}

export function AccommodationStep({
	value,
	onChange,
	onNext,
	onBack,
	translations
}: AccommodationStepProps) {
	const formSchema = z.object({
		accommodation: z.string().min(3, {
			message: translations.validation.name,
		}),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			accommodation: value,
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		onChange(values.accommodation)
		onNext()
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
					<FormField
						control={form.control}
						name="accommodation"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{translations.name}</FormLabel>
								<FormControl>
									<Input
										placeholder={translations.placeholder}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-between gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onBack}
							className="w-1/3 sm:w-1/4 bg-transvip hover:bg-transvip-dark h-10 text-white hover:text-white"
						>
							<ArrowLeftIcon className="w-4 h-4" /> {translations.back}
						</Button>
						<Button type="submit" className="w-1/2 h-10">
							{translations.continue} <ArrowRightIcon className="w-4 h-4" />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
} 