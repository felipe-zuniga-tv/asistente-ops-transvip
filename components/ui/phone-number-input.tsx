"use client"

import React from "react"
import { forwardRef } from "react"
import type { Country } from "react-phone-number-input"
// Import the input-only component
import Input from "react-phone-number-input/input"
import { cn } from "@/utils/ui"

// Import Shadcn UI Components
import { Input as ShadcnInput, type InputProps } from "@/components/ui/input" // Alias Shadcn Input
import PhoneInput from "react-phone-number-input/input"

// --- Types ---
interface PhoneNumberInputProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"onChange" | "value" // Omit conflicting HTML props
	> {
	value: string | undefined // E.164 format string or undefined
	onChange: (value: string | undefined) => void // Callback with E.164 string or undefined
	defaultCountry?: Country
	placeholder?: string
	disabled?: boolean
	className?: string // Optional className for the Shadcn Input component
}

// --- Custom Input Component for BasePhoneNumberInput ---
// Forwards the ref and applies Shadcn styles + type="tel"
const CustomPhoneNumberInput = forwardRef<HTMLInputElement, InputProps>(
	({ className, ...props }, ref) => {
		return (
			<ShadcnInput
				className={cn("flex-1 h-12", className)} // Ensure it takes up space
				{...props}
				ref={ref}
				type="tel" // Set input type to telephone
			/>
		)
	},
)
CustomPhoneNumberInput.displayName = "CustomPhoneNumberInput"

// --- Main Phone Number Input Component (Simplified) ---

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
	value,
	onChange,
	defaultCountry,
	placeholder,
	disabled,
	className, // This className will be passed to the ShadcnInput via CustomPhoneNumberInput
	...rest // Pass remaining props like name, id, etc.
}) => {
	const setValue = (value: string | undefined) => {
		onChange(value)
	}
	return (
		<PhoneInput
			placeholder="Enter phone number"
			value={value}
			onChange={setValue} />
	)
}

PhoneNumberInput.displayName = "PhoneNumberInput"

// --- Removed Components & Helpers ---
// - CountryCodeSelect component
// - getCountryFromCode helper
// - getCodeFromCountry helper
// - Imports for flags, labels, Shadcn Select, getCountryCallingCode, getCountries, isSupportedCountry
// - Internal state management (internalPhoneNumber, internalCountryCode)
// - useEffect for syncing state
// - Wrapper div around select and input