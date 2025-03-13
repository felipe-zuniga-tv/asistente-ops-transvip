'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { type Language } from '@/lib/core/i18n'
import { ArrowRightIcon } from 'lucide-react'
import { languages } from '../language-selector'

interface LanguageStepProps {
	value: Language
	onChange: (value: Language) => void
	onNext: () => void
	translations: {
		title: string
		description: string
		continue: string
	}
}

export function LanguageStep({ value, onChange, onNext, translations }: LanguageStepProps) {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold text-center">{translations.title}</h2>
				<p className="text-muted-foreground text-center text-sm">
					{translations.description}
				</p>
			</div>

			<RadioGroup value={value} onValueChange={onChange} className="grid gap-4">
				{languages.map((lang) => (
					<div key={lang.value} className="flex items-center">
						<RadioGroupItem
							value={lang.value}
							id={lang.value}
							className="peer sr-only"
						/>
						<Label
							htmlFor={lang.value}
							className="flex items-center justify-between w-full p-4 border rounded-lg cursor-pointer hover:bg-muted peer-data-[state=checked]:border-primary"
						>
							<div className="flex items-center gap-3">
								<span className="text-2xl">{lang.flag}</span>
								<div>
									<p className="font-medium">{lang.label}</p>
									<p className="hidden text-sm text-muted-foreground">
										{lang.region}
									</p>
								</div>
							</div>
						</Label>
					</div>
				))}
			</RadioGroup>

			<Button variant="default" onClick={onNext} disabled={!value}
				className="w-full bg-transvip hover:bg-transvip-dark h-10"
			>
				{translations.continue} <ArrowRightIcon className="w-4 h-4" />
			</Button>
		</div>
	)
} 