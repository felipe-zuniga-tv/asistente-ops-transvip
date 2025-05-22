import { translations } from '@/lib/core/i18n';

export type Language = keyof typeof translations;
export type Translation = typeof translations[Language]; 