'use client'

import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Language } from '@/lib/core/i18n'

interface LanguageOption {
	value: Language
	label: string
	flag: string
	region: string
}

interface LanguageSelectorProps {
    language: Language
}

export const languages: LanguageOption[] = [
	{ value: 'es-CL', label: 'Español', flag: '🇨🇱 🇪🇸', region: 'Chile' },
	{ value: 'pt-BR', label: 'Português', flag: '🇧🇷 🇵🇹', region: 'Brasil' },
	{ value: 'en-US', label: 'English', flag: '🇺🇸 🇬🇧', region: 'United States' },
	{ value: 'de-DE', label: 'Deutsch', flag: '🇩🇪', region: 'Deutschland' },
]

export function LanguageSelector({ language }: LanguageSelectorProps) {
    const router = useRouter()

    return (
        <Select 
            value={language} 
            onValueChange={(value: Language) => {
                const url = new URL(window.location.href)
                url.searchParams.set('lang', value)
                router.push(url.pathname + url.search)
            }}
        >
            <SelectTrigger className="max-w-[180px] bg-gray-100">
                <SelectValue>
                    {languages.find(lang => lang.value === language)?.flag} {languages.find(lang => lang.value === language)?.label}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                        <span className="flex items-center gap-2">
                            <span className="text-lg">{lang.flag}</span>
                            <span>{lang.label}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
} 