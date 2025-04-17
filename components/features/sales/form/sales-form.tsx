'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Routes } from '@/utils/routes'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { getTranslation, type Language } from '@/lib/core/i18n/'
import { createSalesResponse } from '@/lib/services/sales'
// Import necessary types and functions from react-phone-number-input
import type { Country } from 'react-phone-number-input';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';

// Form Steps
import { LanguageStep } from './language-step'
import { PersonalInfoStep } from './personal-info-step'
import { TravelInfoStep } from './travel-info-step'
import { AccommodationStep } from './accommodation-step'
import { ConfirmationStep } from './confirmation-step'
import { TransvipLogo } from '@/components/features/transvip/transvip-logo'

// Constants
const BASE_PASSWORD = 'Contraseña123!'

interface SalesFormData {
	language: Language
	firstName: string
	lastName: string
	email: string
	phoneNumber: string
	countryCode?: string
	country?: Country
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

	// Helper function to find Country ISO code from calling code
	const getCountryFromCode = (callingCode: string | undefined): Country | undefined => {
		if (!callingCode) return undefined;
		const numericCode = callingCode.replace('+', '');
		const countries = getCountries();
		return countries.find(country => getCountryCallingCode(country) === numericCode);
	};

	const updateFormData = (data: Partial<SalesFormData>) => {
		let updatedData = { ...data };
		let currentCountryCode = formData.countryCode;
		let currentPhoneNumber = formData.phoneNumber;
		let currentCountry = formData.country;
	
		// Determine the country code and phone number to use for cleaning/formatting
		const countryCodeToUse = data.countryCode !== undefined ? data.countryCode : currentCountryCode;
		const phoneNumberToUse = data.phoneNumber !== undefined ? data.phoneNumber : currentPhoneNumber;
	
		if (phoneNumberToUse && countryCodeToUse) {
			// Ensure country code starts with '+' and remove duplicates
			const cleanCountryCode = `+${(countryCodeToUse || '').replace(/^\+/, '')}`;
			
			// Clean the phone number: remove the determined country code prefix if present
			let cleanPhoneNumber = (phoneNumberToUse || '').replace(/^\+/, ''); // Remove leading + if any
			if (cleanPhoneNumber.startsWith(cleanCountryCode.replace('+', ''))) {
				cleanPhoneNumber = cleanPhoneNumber.substring(cleanCountryCode.length - 1);
			}
			
			// Find the corresponding Country ISO code
			const countryFromCode = getCountryFromCode(cleanCountryCode);

			// Update the data object passed to setFormData
			updatedData = {
				...updatedData,
				countryCode: cleanCountryCode,
				phoneNumber: cleanPhoneNumber,
				country: data.country !== undefined ? data.country : countryFromCode, // Prioritize explicitly passed country
			};

			// If country was explicitly passed, ensure countryCode matches
			if (data.country && !data.countryCode) {
				updatedData.countryCode = `+${getCountryCallingCode(data.country)}`;
			}

		} else if (data.country && !countryCodeToUse) {
			// Handle case where only country is set (e.g., from CountrySelect)
			const newCountryCode = `+${getCountryCallingCode(data.country)}`;
			updatedData = {
				...updatedData,
				country: data.country,
				countryCode: newCountryCode,
				// Reset phone number if country changes without a new number provided? Optional.
				// phoneNumber: data.phoneNumber !== undefined ? data.phoneNumber : undefined, 
			};
		}
	
		setFormData(prev => ({ ...prev, ...updatedData }));
	};

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
			if (!customerResult || 'error' in customerResult) {
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

	console.log(`step: ${step}`)
	console.log(formData)

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
							country: formData.country,
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
							language: formData.language,
							firstName: formData.firstName,
							lastName: formData.lastName,
							email: formData.email,
							phoneNumber: formData.phoneNumber,
							countryCode: formData.countryCode,
							returnDateTime: formData.returnDateTime,
							accommodation: formData.accommodation,
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
