'use client'

import { useState, useEffect } from 'react'
import {
	Button,
	Label,
} from '@/components/ui'
import { Loader2, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import type { Country } from 'react-phone-number-input'
import { getCountries, getCountryCallingCode, isPossiblePhoneNumber } from 'react-phone-number-input/input'
// Use the standard PhoneInput component
import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css' // Import stylesheet for standard PhoneInput
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { CountrySelect } from './country-select'

interface TravelInfoStepProps {
	data: {
		country?: Country
		returnDateTime: Date | null
		countryCode?: string
		phoneNumber?: string
	}
	onChange: (data: {
		returnDateTime?: Date | null
		countryCode?: string
		phoneNumber?: string
		country?: Country
	}) => void
	onNext: () => void
	onBack: () => void
	translations: {
		title: string
		description: string
		country: string
		phoneNumber: string
		returnDateTime: string
		selectDate: string
		selectCountry: string
		searchCountry: string
		noCountryFound: string
		continue: string
		back: string
		validation: {
			returnDateTime: string
			countryRequired: string
			phoneNumberRequired: string
			phoneNumberInvalid: string // Added for more specific validation
		}
	}
}

// Validation functions
function validateCountry(country: Country | undefined): string | null {
	if (!country || !getCountries().includes(country)) {
		return 'validation.countryRequired';
	}
	return null;
}

function validatePhoneNumber(phoneNumber: string | undefined, country: Country | undefined): string | null {
	if (!phoneNumber || phoneNumber.trim() === '' || phoneNumber.trim().length < 3) {
		return 'validation.phoneNumberRequired';
	}
	// Use isPossiblePhoneNumber for basic validation
	if (country && phoneNumber && !isPossiblePhoneNumber(phoneNumber, country)) {
		return 'validation.phoneNumberInvalid';
	}
	// You might want to add more specific length checks or use a stricter validation function if needed
	return null;
}

function validateReturnDateTime(returnDateTime: Date | null): string | null {
	if (!returnDateTime) {
		return 'validation.returnDateTime';
	}
	return null;
}


export function TravelInfoStep({
	data,
	onChange,
	onNext,
	onBack,
	translations
}: TravelInfoStepProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(data.country);
	const [phoneNumber, setPhoneNumber] = useState<string | undefined>(`${data.countryCode}${data.phoneNumber}`);
	const [returnDateTime, setReturnDateTime] = useState<Date | null>(data.returnDateTime);

	const [errors, setErrors] = useState<{
		country?: string;
		phoneNumber?: string;
		returnDateTime?: string;
	}>({});

	const handleValidation = () => {
		const countryError = validateCountry(selectedCountry);
		const phoneError = validatePhoneNumber(phoneNumber, selectedCountry);
		const dateTimeError = validateReturnDateTime(returnDateTime);

		const newErrors = {
			country: countryError ? translations.validation[countryError as keyof typeof translations.validation] : undefined,
			phoneNumber: phoneError ? translations.validation[phoneError as keyof typeof translations.validation] : undefined,
			returnDateTime: dateTimeError ? translations.validation[dateTimeError as keyof typeof translations.validation] : undefined,
		};

		setErrors(newErrors);

		// Return true if there are no errors
		return !newErrors.country && !newErrors.phoneNumber && !newErrors.returnDateTime;
	};

	async function handleNext() {
		if (!handleValidation()) {
			return; // Stop if validation fails
		}

		try {
			setIsSubmitting(true)
			onChange({
				returnDateTime: returnDateTime,
				country: selectedCountry,
				phoneNumber: phoneNumber,
			})
			onNext()
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleCountryChange = (newCountry: Country | undefined) => {
		setSelectedCountry(newCountry);
		setPhoneNumber(undefined);
		onChange({ country: newCountry, phoneNumber: undefined });

		const countryError = validateCountry(newCountry);
		const phoneError = validatePhoneNumber(undefined, newCountry);
		setErrors({
			...errors,
			country: countryError ? translations.validation[countryError as keyof typeof translations.validation] : undefined,
			phoneNumber: phoneError ? translations.validation[phoneError as keyof typeof translations.validation] : undefined
		});
	};

	const handlePhoneChange = (newPhoneNumber: string | undefined) => {
		setPhoneNumber(newPhoneNumber);
		onChange({ phoneNumber: newPhoneNumber, country: selectedCountry });

		const phoneError = validatePhoneNumber(newPhoneNumber, selectedCountry);
		setErrors(prev => ({ ...prev, phoneNumber: phoneError ? translations.validation[phoneError as keyof typeof translations.validation] : undefined }));
	};

	const handleDateTimeChange = (newDateTime: Date | undefined) => {
		const date = newDateTime ?? null;
		setReturnDateTime(date);
		onChange({ returnDateTime: date });

		const dateTimeError = validateReturnDateTime(date);
		setErrors(prev => ({ ...prev, returnDateTime: dateTimeError ? translations.validation[dateTimeError as keyof typeof translations.validation] : undefined }));
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h2 className="text-2xl font-bold text-center">{translations.title}</h2>
				<p className="text-muted-foreground text-center">
					{translations.description}
				</p>
			</div>

			<div className="flex flex-col gap-4">
				{/* Phone Number Input Group */}
				<div className="flex gap-1 items-start">
					{/* Country Select */}
					<div className="space-y-0 w-2/5 flex flex-col gap-1">
						<Label htmlFor="country-select" className="text-sm font-medium">{translations.phoneNumber}</Label>
						<CountrySelect
							value={selectedCountry}
							onChange={handleCountryChange}
							disabled={isSubmitting}
							translations={{
								selectCountry: translations.selectCountry,
								searchCountry: translations.searchCountry,
								noCountryFound: translations.noCountryFound
							}}
						/>
						<div className="h-5 text-xs text-destructive">
							{errors.country && <span>{errors.country}</span>}
						</div>
					</div>

					{/* Phone Input */}
					<div className="space-y-0 flex-1 flex flex-col gap-1">
						<Label htmlFor="phone-input" className="text-sm font-medium h-5 invisible">Placeholder</Label>
						{/* Use standard PhoneInput */}
						<PhoneInput
							id="phone-input"
							// Add the necessary CSS class for styling
							className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							placeholder={translations.phoneNumber}
							country={selectedCountry}
							value={phoneNumber}
							onChange={handlePhoneChange} // Use the direct onChange handler
							disabled={isSubmitting || !selectedCountry} // Disable if no country selected
							// international={!selectedCountry} // Use international format if no country
							// countryCallingCodeEditable={false} // Don't allow editing the code directly
						/>
						<div className="h-5 text-xs text-destructive">
							{errors.phoneNumber && <span>{errors.phoneNumber}</span>}
						</div>
					</div>
				</div>

				{/* Date Time Picker */}
				<div className="flex flex-col gap-1">
					<DateTimePicker
						id="return-date-time"
						value={returnDateTime}
						onChange={handleDateTimeChange}
						label={translations.returnDateTime}
						placeholder={translations.selectDate}
						disabled={isSubmitting}
					/>
					<div className="h-5 text-xs text-destructive">
						{errors.returnDateTime && <span>{errors.returnDateTime}</span>}
					</div>
				</div>


				{/* Action Buttons */}
				<div className="flex justify-between gap-3 pt-4">
					<Button
						type="button"
						variant="outline"
						onClick={onBack}
						disabled={isSubmitting}
						className="w-1/3 sm:w-1/4 bg-transvip hover:bg-transvip-dark h-10 text-white hover:text-white"
					>
						<ArrowLeftIcon className="w-4 h-4 mr-1" /> {translations.back}
					</Button>
					<Button
						type="button" // Change to button type
						onClick={handleNext} // Use custom handler
						className="w-1/2 h-10"
						disabled={isSubmitting || !!errors.country || !!errors.phoneNumber || !!errors.returnDateTime} // Disable based on errors or submission state
					>
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
			</div>
		</div>
	)
} 