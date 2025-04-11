"use client"

import { cn } from '@/utils/ui'
import { Input } from "@/components/ui/input"
import { ChevronDown, Phone } from "lucide-react"
import type React from "react"
import { forwardRef, useId, useState, useEffect } from "react"
import * as RPNInput from "react-phone-number-input"
import flags from "react-phone-number-input/flags"
import type { Country } from 'react-phone-number-input'

interface PhoneNumberInputProps {
	id?: string
	value: {
		phoneNumber: string
		countryCode?: string
	}
	onChange: (value: { phoneNumber: string; countryCode?: string }) => void
	placeholder?: string
	disabled?: boolean
}

export function PhoneNumberInput({ 
	id: externalId, 
	value, 
	onChange, 
	placeholder,
	disabled 
}: PhoneNumberInputProps) {
	const internalId = useId()
	const id = externalId || internalId
	const [country, setCountry] = useState<Country>()

	// Sync country from countryCode prop initially
	useEffect(() => {
		if (value.countryCode) {
			const countryFromCode = RPNInput.getCountries().find(
				country => `+${RPNInput.getCountryCallingCode(country)}` === value.countryCode
			)
			if (countryFromCode && countryFromCode !== country) {
				setCountry(countryFromCode)
			}
		}
	}, [value.countryCode, country])

	const handlePhoneChange = (newFullNumber: string | undefined) => {
		if (!newFullNumber) {
			onChange({ phoneNumber: "", countryCode: undefined })
			return
		}

		// If there's a country selected, we know its code
		if (country) {
			const countryCode = `+${RPNInput.getCountryCallingCode(country)}`
			const nationalNumber = newFullNumber.replace(countryCode, '').trim()
			
			onChange({
				phoneNumber: nationalNumber,
				countryCode
			})
			return
		}

		// If no country is selected, treat the input as just a phone number
		onChange({
			phoneNumber: newFullNumber,
			countryCode: undefined
		})
	}

	const handleCountryChange = (newCountry: Country) => {
		setCountry(newCountry)
		
		if (newCountry) {
			const newCountryCode = `+${RPNInput.getCountryCallingCode(newCountry)}`
			
			onChange({
				phoneNumber: value.phoneNumber,
				countryCode: newCountryCode
			})
		} else {
			onChange({
				phoneNumber: value.phoneNumber,
				countryCode: value.countryCode
			})
		}
	}

	return (
		<div className="w-full" dir="ltr">
			<RPNInput.default
				international
				id={id}
				countryCallingCodeEditable={false}
				flagComponent={FlagComponent}
				countrySelectComponent={CountrySelect}
				inputComponent={PhoneInput}
				disabled={disabled}
				placeholder={placeholder}
				value={(() => {
					if (!value.phoneNumber) return ""
					if (!country) return value.phoneNumber
					
					// Remove any existing "+" prefix from countryCode
					const cleanCountryCode = (value.countryCode || `+${RPNInput.getCountryCallingCode(country)}`).replace(/^\+/, '')
					const cleanPhoneNumber = value.phoneNumber.replace(cleanCountryCode, '').replace(/^\+/, '')

					return `+${cleanCountryCode}${cleanPhoneNumber}`
				})()}
				onChange={handlePhoneChange}
				onCountryChange={handleCountryChange}
				country={country}
				className="flex rounded-md shadow-sm"
			/>
		</div>
	)
}

const PhoneInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className = "", ...props }, ref) => {
	return (
		<Input 
			className={cn("-ms-px rounded-s-none shadow-none focus-visible:z-10", className)} 
			ref={ref} 
			{...props} 
		/>
	)
})

PhoneInput.displayName = "PhoneInput"

type CountrySelectProps = {
	disabled?: boolean
	value: RPNInput.Country
	onChange: (value: RPNInput.Country) => void
	options: { label: string; value: RPNInput.Country | undefined }[]
}

const CountrySelect = ({ disabled, value, onChange, options }: CountrySelectProps) => {
	const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
		onChange(event.target.value as RPNInput.Country)
	}

	return (
		<div className="border-input bg-background text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 hover:bg-accent hover:text-foreground relative inline-flex items-center self-stretch rounded-s-md border py-2 ps-3 pe-2 transition-colors outline-none focus-within:z-10 focus-within:ring-[3px] has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50">
			<div className="inline-flex items-center gap-1" aria-hidden="true">
				<FlagComponent country={value} countryName={value} aria-hidden="true" />
				<span className="text-muted-foreground/80">
					<ChevronDown size={16} aria-hidden="true" />
				</span>
			</div>
			<select
				disabled={disabled}
				value={value}
				onChange={handleSelect}
				className="absolute inset-0 text-sm opacity-0"
				aria-label="Select country"
			>
				<option key="default" value="">
					Selecciona un país
				</option>
				{options
					.filter((x) => x.value)
					.map((option, i) => (
						<option key={option.value ?? `empty-${i}`} value={option.value}>
							{option.label} {option.value && `+${RPNInput.getCountryCallingCode(option.value)}`}
						</option>
					))}
			</select>
		</div>
	)
}

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
	const Flag = flags[country]

	return (
		<span className="w-5 overflow-hidden rounded-sm">
			{Flag ? <Flag title={countryName} /> : <Phone size={16} aria-hidden="true" />}
		</span>
	)
}