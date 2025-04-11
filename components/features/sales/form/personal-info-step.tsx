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

interface PersonalInfoStepProps {
	data: {
		firstName: string
		lastName: string
		email: string
	}
	onChange: (data: {
		firstName: string
		lastName: string
		email: string
	}) => void
	onNext: () => void
	onBack: () => void
	translations: {
		title: string
		description: string
		firstName: string
		lastName: string
		email: string
		continue: string
		back: string
		validation: {
			firstName: string
			lastName: string
			email: string
		}
		placeholders: {
			firstName: string
			lastName: string
			email: string
		}
	}
}

export function PersonalInfoStep({
	data,
	onChange,
	onNext,
	onBack,
	translations
}: PersonalInfoStepProps) {
	const formSchema = z.object({
		firstName: z.string().min(2, {
			message: translations.validation.firstName,
		}),
		lastName: z.string().min(2, {
			message: translations.validation.lastName,
		}),
		email: z.string().email({
			message: translations.validation.email,
		}),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		onChange(values)
		onNext()
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h2 className="text-2xl font-bold text-center">{translations.title}</h2>
				<p className="text-muted-foreground text-center">
					{translations.description}
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem className="space-y-0 flex flex-col gap-2">
								<FormLabel>{translations.firstName}</FormLabel>
								<FormControl>
									<Input placeholder={translations.placeholders.firstName} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem className="space-y-0 flex flex-col gap-2">
								<FormLabel>{translations.lastName}</FormLabel>
								<FormControl>
									<Input placeholder={translations.placeholders.lastName} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="space-y-0 flex flex-col gap-2">
								<FormLabel>{translations.email}</FormLabel>
								<FormControl>
									<Input
										placeholder={translations.placeholders.email}
										type="email"
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