'use client'

import type { Country } from 'react-phone-number-input'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import flags from 'react-phone-number-input/flags'
import { es } from 'date-fns/locale'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/utils/ui'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

const FlagComponent = ({ country, countryName }: { country: Country; countryName: string }) => {
	const Flag = flags[country]

	return (
		<span className="flex h-4 w-4 overflow-hidden rounded-sm" title={countryName}>
			{Flag ? (
				<Flag title={countryName} />
			) : (
				<div className="h-full w-full bg-muted"></div>
			)}
		</span>
	)
}

interface CountrySelectProps {
	value?: Country;
	onChange: (value: Country) => void;
	disabled?: boolean;
	translations: {
		selectCountry: string;
		searchCountry: string;
		noCountryFound: string;
	};
}

export function CountrySelect({ value, onChange, disabled, translations }: CountrySelectProps) {
	const [open, setOpen] = React.useState(false)

	const countryOptions = React.useMemo(() => getCountries().map(countryCode => ({
		value: countryCode,
		label: new Intl.DisplayNames([es.code], { type: 'region' }).of(countryCode) || countryCode,
		callingCode: getCountryCallingCode(countryCode),
	})).sort((a, b) => a.label.localeCompare(b.label)), []);

	const selectedCountry = React.useMemo(() => {
		return countryOptions.find(option => option.value === value);
	}, [countryOptions, value]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between h-9 px-3"
					disabled={disabled}
				>
					{selectedCountry ? (
						<div className="flex items-center gap-2 overflow-hidden">
							<FlagComponent country={selectedCountry.value} countryName={selectedCountry.label} />
							<span className="truncate">{selectedCountry.label} (+{selectedCountry.callingCode})</span>
						</div>
					) : (
						<span className="text-muted-foreground">{translations.selectCountry}</span>
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[--radix-popover-trigger-width] min-w-[220px] p-0">
				<Command>
					<CommandInput placeholder={translations.searchCountry} />
					<CommandList>
						<ScrollArea className="h-[200px]">
							<CommandEmpty>{translations.noCountryFound}</CommandEmpty>
							<CommandGroup>
								{countryOptions.map((option) => (
									<CommandItem
										key={option.value}
										value={`${option.label} ${option.value} ${option.callingCode}`} // Search by label, code, or calling code
										onSelect={() => {
											onChange(option.value as Country)
											setOpen(false)
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === option.value ? "opacity-100" : "opacity-0"
											)}
										/>
										<div className="flex items-center gap-2">
											<FlagComponent country={option.value} countryName={option.label} />
											<span>{option.label} (+{option.callingCode})</span>
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
} 