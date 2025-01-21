'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { getTranslation, type Language } from '@/lib/translations/'

// Form Steps
import { LanguageStep } from './language-step'
import { PersonalInfoStep } from './personal-info-step'
import { TravelInfoStep } from './travel-info-step'
import { AccommodationStep } from './accommodation-step'
import { ConfirmationStep } from './confirmation-step'
import { TransvipLogo } from '@/components/transvip/transvip-logo'

interface SalesFormData {
	language: Language
	firstName: string
	lastName: string
	email: string
	phoneCountry: string
	phoneNumber: string
	returnDate: Date | null
	returnTime: string
	accommodation: string
}

interface SalesFormProps {
	branchCode: string
	initialLanguage: Language
	onSuccess?: () => void
}

export function SalesForm({ branchCode, initialLanguage, onSuccess }: SalesFormProps) {
	const [step, setStep] = useState(1)
	const [formData, setFormData] = useState<SalesFormData>({
		language: initialLanguage,
		firstName: '',
		lastName: '',
		email: '',
		phoneCountry: '+56',
		phoneNumber: '',
		returnDate: null,
		returnTime: '',
		accommodation: ''
	})

	const { toast } = useToast()
	const totalSteps = 5
	const t = getTranslation(formData.language)

	const updateFormData = (data: Partial<SalesFormData>) => {
		setFormData(prev => ({ ...prev, ...data }))
	}

	const nextStep = () => {
		setStep(prev => Math.min(prev + 1, totalSteps))
	}

	const prevStep = () => {
		setStep(prev => Math.max(prev - 1, 1))
	}

	const handleSubmit = async () => {
		try {
			// Here you would typically send the data to your backend
			console.log('Form submitted:', { branch: branchCode, ...formData })

			// Show success message
			toast({
				title: t.success.title,
				description: t.success.description,
				duration: 3000,
			})

			// Reset after 3 seconds
			setTimeout(() => {
				setStep(1)
				setFormData({
					language: initialLanguage,
					firstName: '',
					lastName: '',
					email: '',
					phoneCountry: '+56',
					phoneNumber: '',
					returnDate: null,
					returnTime: '',
					accommodation: ''
				})
				onSuccess?.()
			}, 3000)
		} catch (error) {
			toast({
				title: t.error.title,
				description: t.error.description,
				variant: 'destructive',
			})
		}
	}

	return (
		<div className="container max-w-2xl mx-auto p-4 sm:py-8">
			<Card>
				<CardContent className="pt-6">
					<Progress value={(step / totalSteps) * 100} className="mb-4" />

					<div className="flex justify-center mb-4">
						<TransvipLogo size={30} />
					</div>

					<div className="space-y-6">
						{step === 1 && (
							<LanguageStep
								value={formData.language}
								onChange={(language) => updateFormData({ language })}
								onNext={nextStep}
								translations={t.steps.language}
							/>
						)}

						{step === 2 && (
							<PersonalInfoStep
								data={{
									firstName: formData.firstName,
									lastName: formData.lastName,
									email: formData.email
								}}
								onChange={(data) => updateFormData(data)}
								onNext={nextStep}
								onBack={prevStep}
								translations={t.steps.personal}
							/>
						)}

						{step === 3 && (
							<TravelInfoStep
								data={{
									phoneCountry: formData.phoneCountry,
									phoneNumber: formData.phoneNumber,
									returnDate: formData.returnDate,
									returnTime: formData.returnTime
								}}
								onChange={(data) => updateFormData(data)}
								onNext={nextStep}
								onBack={prevStep}
								translations={t.steps.travel}
							/>
						)}

						{step === 4 && (
							<AccommodationStep
								value={formData.accommodation}
								onChange={(accommodation) => updateFormData({ accommodation })}
								onNext={nextStep}
								onBack={prevStep}
								onSubmit={handleSubmit}
								translations={t.steps.accommodation}
							/>
						)}

						{step === 5 && (
							<ConfirmationStep
								formData={formData}
								translations={t.steps.confirmation}
							/>
						)}
					</div>
				</CardContent>
				<CardFooter className="bg-gray-200 rounded-b-lg p-0">
					<div className="w-full flex items-center justify-center text-sm text-black p-3">
						© {new Date().getFullYear()} · Transvip
					</div>
				</CardFooter>
			</Card>
		</div>
	)
} 