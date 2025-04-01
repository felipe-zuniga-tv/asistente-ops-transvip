'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Routes } from '@/utils/routes'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { getTranslation, type Language } from '@/lib/core/i18n/'
import { createSalesResponse } from '@/lib/services/sales'

// Form Steps
import { LanguageStep } from './language-step'
import { PersonalInfoStep } from './personal-info-step'
import { TravelInfoStep } from './travel-info-step'
import { AccommodationStep } from './accommodation-step'
import { ConfirmationStep } from './confirmation-step'
import { TransvipLogo } from '@/components/transvip/transvip-logo'

// Constants
const BASE_PASSWORD = 'Contraseña123!'

interface SalesFormData {
	language: Language
	firstName: string
	lastName: string
	email: string
	phoneNumber: string
	countryCode?: string
	returnDateTime: Date | null
	accommodation: string
}

interface SalesFormProps {
	branchCode: string
	branchName: string
	initialLanguage: Language
	onSuccess?: () => void
}

export const runtime = 'edge';
export const revalidate = 3600; // Cache the page for 1 hour

export function SalesForm({ branchCode, branchName, initialLanguage, onSuccess }: SalesFormProps) {
	const [step, setStep] = useState(initialLanguage ? 2 : 1)
	const isSubmitting = useRef(false)
	const [formData, setFormData] = useState<SalesFormData>({
		language: initialLanguage,
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
		countryCode: '',
		returnDateTime: null,
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

	const handleSubmit = useCallback(async () => {
		if (isSubmitting.current) return;

		try {
			isSubmitting.current = true;

			// Create customer account via internal API route
			const payload = {
				lang: formData.language === 'en-US' ? 0 : 1,
				first_name: formData.firstName,
				last_name: formData.lastName,
				email: formData.email.toLowerCase(),
				country_code: formData.countryCode || '',
				phone_number: formData.phoneNumber,
				password: BASE_PASSWORD,
				timezone: new Date().getTimezoneOffset().toString(),
			}

			const customerResponse = await fetch(Routes.API.CUSTOMER_SIGNUP, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			const customerResult = await customerResponse.json();

			// Only proceed with sales response if customer account was created successfully
			if (!customerResult || 'error' in customerResult || customerResult.status !== 200) {
				throw new Error('No fue posible crear el usuario en el sistema. Consulta en counter para avanzar.');
			}

			// Format return date and time
			const returnDate = formData.returnDateTime ? new Date(formData.returnDateTime).toISOString().split('T')[0] : null;
			const returnTime = formData.returnDateTime ? new Date(formData.returnDateTime).toLocaleTimeString('es-CL', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) : null;

			const salesResult = await createSalesResponse({
				branch_code: branchCode,
				branch_name: branchName,
				language: formData.language,
				first_name: formData.firstName,
				last_name: formData.lastName,
				email: formData.email,
				country_code: formData.countryCode,
				phone_number: formData.phoneNumber,
				return_date: returnDate,
				return_time: returnTime,
				accommodation: formData.accommodation,
			});

			if (!salesResult) {
				throw new Error('No fue posible guardar la información del formulario. Consulta en counter para avanzar.');
			}

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
					phoneNumber: '',
					countryCode: '',
					returnDateTime: null,
					accommodation: ''
				})
				onSuccess?.()
			}, 3000)
		} catch (error) {
			console.error('Form submission error:', error)
			toast({
				title: t.error.title,
				description: error instanceof Error ? error.message : t.error.description,
				variant: 'destructive',
				duration: 3000,
			})
			onSuccess?.()
		} finally {
			isSubmitting.current = false;
		}
	}, [branchCode, branchName, formData, initialLanguage, onSuccess, t.error.description, t.error.title, t.success.description, t.success.title, toast]);

	return (
		<Card>
			<CardContent className="pt-6">
				<Progress value={(step / totalSteps) * 100} className="mb-4" />

				<div className="flex justify-center mb-4">
					<Link href={Routes.PUBLIC.SUCURSALES}>
						<TransvipLogo size={24} />
					</Link>
				</div>

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
							phoneNumber: formData.phoneNumber,
							countryCode: formData.countryCode,
							returnDateTime: formData.returnDateTime
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
						translations={t.steps.accommodation}
					/>
				)}

				{step === 5 && (
					<ConfirmationStep
						formData={{
							...formData,
							phoneNumber: formData.phoneNumber,
							countryCode: formData.countryCode
						}}
						translations={t.steps.confirmation}
						onSubmit={handleSubmit}
					/>
				)}
			</CardContent>
			<CardFooter className="bg-gray-200 rounded-b-lg p-0">
				<div className="w-full flex items-center justify-center text-sm text-black p-3">
					© {new Date().getFullYear()} · Transvip
				</div>
			</CardFooter>
		</Card>
	)
}
