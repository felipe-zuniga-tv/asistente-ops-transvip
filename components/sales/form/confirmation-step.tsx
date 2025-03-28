'use client'

import { useEffect, useRef } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { type Language } from '@/lib/core/i18n'
import { es } from 'date-fns/locale'

interface ConfirmationStepProps {
	formData: {
		language: Language
		firstName: string
		lastName: string
		email: string
		phoneNumber: string
		countryCode?: string
		returnDate: Date | null
		returnTime: string
		accommodation: string
	}
	translations: {
		title: string
		description: string
		personalInfo: string
		contactInfo: string
		returnFlight: string
		accommodation: string
		notSpecified: string
		redirecting: string
	}
	onSubmit: () => void
}

export function ConfirmationStep({ formData, translations, onSubmit }: ConfirmationStepProps) {
	const hasSubmitted = useRef(false);

	useEffect(() => {
		if (!hasSubmitted.current) {
			hasSubmitted.current = true;
			onSubmit();
		}
	}, [onSubmit]);

	return (
		<div className="flex flex-col items-center gap-4 w-full">
			<div className="flex flex-col items-center gap-2">
				<CheckCircle2 className="h-12 w-12 text-green-500" />
				<h2 className="text-2xl font-bold">{translations.title}</h2>
				<p className="text-muted-foreground">
					{translations.description}
				</p>
			</div>

			<div className="w-full flex flex-col gap-6 text-left p-6 bg-muted rounded-lg shadow-md">
				<div>
					<h3 className="font-bold text-transvip">{translations.personalInfo}</h3>
					<div className="flex flex-row items-center gap-2">
						<p className="text-sm">{formData.firstName} {formData.lastName}</p>
						<span className="text-center">·</span>
						<p className="text-sm">{formData.email}</p>
					</div>
				</div>

				<div>
					<h3 className="font-bold text-transvip">{translations.contactInfo}</h3>
					<p className="text-sm">{formData.countryCode} {formData.phoneNumber}</p>
				</div>

				<div>
					<h3 className="font-bold text-transvip">{translations.returnFlight}</h3>
					<p className="text-sm">
						{formData.returnDate
							? format(formData.returnDate, 'PPP', { locale: es })
							: translations.notSpecified}{' '}
						· {formData.returnTime}
					</p>
				</div>

				<div>
					<h3 className="font-bold text-transvip">{translations.accommodation}</h3>
					<p className="text-sm">{formData.accommodation}</p>
				</div>
			</div>

			<p className="text-sm text-muted-foreground animate-pulse">
				{translations.redirecting}
			</p>
		</div>
	)
} 