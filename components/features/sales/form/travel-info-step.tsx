'use client'

import { useState } from 'react'
import {
	Button,
	Label,
	TimePickerInput,
} from '@/components/ui'
import { Loader2, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import type { Country } from 'react-phone-number-input'
import { getCountries, isPossiblePhoneNumber } from 'react-phone-number-input/input'
// Use the standard PhoneInput component
import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css' // Import stylesheet for standard PhoneInput
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { CountrySelect } from './country-select'

interface TravelInfoStepProps {
	data: {
		country?: Country
		returnDate: Date | null
		returnTime: string | null
		countryCode?: string
		phoneNumber?: string
	}
	onChange: (data: {
		returnDate?: Date | null
		returnTime?: string | null
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
		returnDate: string
		returnTime: string
		selectDate: string
		selectTime: string
		hourPlaceholder: string
		minutePlaceholder: string
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
			returnDateRequired: string
			returnTimeRequired: string
		}
	}
}

// Helper to parse "HH:mm" string to Date for the picker
function parseTimeString(timeString: string | null): Date | null {
	if (!timeString) return null;
	const parts = timeString.split(':');
	if (parts.length !== 2) return null;
	const hours = parseInt(parts[0], 10);
	const minutes = parseInt(parts[1], 10);
	if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
	const date = new Date();
	date.setHours(hours, minutes, 0, 0);
	return date;
}

// Helper to format Date from picker to "HH:mm" string
function formatTimeValue(date: Date | undefined | null): string | null {
	if (!date) return null;
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${hours}:${minutes}`;
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

function validateReturnDate(returnDate: Date | null): string | null {
	if (!returnDate) {
		return 'validation.returnDateTime';
	}
	return null;
}

function validateReturnTime(returnTime: string | null): string | null {
	if (!returnTime) {
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
	const [returnDate, setReturnDate] = useState<Date | null>(data.returnDate);
	const [returnTime, setReturnTime] = useState<string | null>(data.returnTime);

	const [errors, setErrors] = useState<{
		country?: string;
		phoneNumber?: string;
		returnDate?: string;
		returnTime?: string;
	}>({});

	const handleValidation = () => {
		const countryError = validateCountry(selectedCountry);
		const phoneError = validatePhoneNumber(phoneNumber, selectedCountry);
		const dateError = validateReturnDate(returnDate);
		const timeError = validateReturnTime(returnTime);

		const newErrors = {
			country: countryError ? translations.validation["countryRequired"] : undefined,
			phoneNumber: phoneError ? translations.validation["phoneNumberRequired"] : undefined,
			returnDate: dateError ? translations.validation["returnDateRequired"] : undefined,
			returnTime: timeError ? translations.validation["returnTimeRequired"] : undefined,
		};

		setErrors(newErrors);

		// Return true if there are no errors
		return !newErrors.country && !newErrors.phoneNumber && !newErrors.returnDate && !newErrors.returnTime;
	};

	async function handleNext() {
		if (!handleValidation()) {
			return; // Stop if validation fails
		}

		try {
			setIsSubmitting(true)
			onChange({
				returnDate: returnDate,
				returnTime: returnTime,
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

	const handleDateChange = (newDate: Date | undefined) => {
		const date = newDate ?? null;
		setReturnDate(date);
		onChange({ returnDate: date });

		const dateError = validateReturnDate(date);
		setErrors(prev => ({ ...prev, returnDate: dateError ? translations.validation[dateError as keyof typeof translations.validation] : undefined }));
	}

	const handleTimeChange = (newTimeDate: Date | undefined) => {
		const timeString = formatTimeValue(newTimeDate);
		setReturnTime(timeString);
		onChange({ returnTime: timeString });

		const timeError = validateReturnTime(timeString);
		setErrors(prev => ({ ...prev, returnTime: timeError ? translations.validation[timeError as keyof typeof translations.validation] : undefined }));
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h2 className="text-2xl font-bold text-center">{translations.title}</h2>
				<p className="text-muted-foreground text-center">
					{translations.description}
				</p>
			</div>

			<div className="flex flex-col gap-2">
				{/* Phone Number Input Group */}
				<div className="flex gap-1 items-start">
					{/* Country Select */}
					<div className="space-y-0 w-1/2 sm:w-2/5 flex flex-col gap-1">
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

				{/* Date Picker */}
				<div className="flex flex-col gap-1">
					<DateTimePicker
						id="return-date"
						mode="date"
						value={returnDate}
						onChange={handleDateChange}
						label={translations.returnDate}
						placeholder={translations.selectDate}
						disabled={isSubmitting}
					/>
					<div className="h-5 text-xs text-destructive">
						{errors.returnDate && <span>{errors.returnDate}</span>}
					</div>
				</div>

				{/* Time Picker */}
				<div className="flex flex-col gap-1">
					<DateTimePicker
						id="return-time"
						mode="time"
						value={parseTimeString(returnTime)}
						onChange={handleTimeChange}
						label={translations.returnTime}
						placeholder={translations.selectTime}
						hourPlaceholder={translations.hourPlaceholder}
						minutePlaceholder={translations.minutePlaceholder}
						disabled={isSubmitting}
					/>
					<div className="h-5 text-xs text-destructive">
						{errors.returnTime && <span>{errors.returnTime}</span>}
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
						disabled={isSubmitting || !!errors.country || !!errors.phoneNumber || !!errors.returnDate || !!errors.returnTime} // Updated disabled condition
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