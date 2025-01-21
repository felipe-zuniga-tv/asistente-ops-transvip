export const languages = [
  {
    code: "es-CL",
    name: "Español (Chile)",
    flag: "🇨🇱",
    region: "CL"
  },
  {
    code: "es-ES",
    name: "Español (España)",
    flag: "🇪🇸",
    region: "ES"
  },
  {
    code: "pt-BR",
    name: "Português (Brasil)",
    flag: "🇧🇷",
    region: "BR"
  },
  {
    code: "pt-PT",
    name: "Português (Portugal)",
    flag: "🇵🇹",
    region: "PT"
  },
  {
    code: "en-US",
    name: "English (US)",
    flag: "🇺🇸",
    region: "US"
  },
  {
    code: "en-GB",
    name: "English (UK)",
    flag: "🇬🇧",
    region: "GB"
  },
  {
    code: "de-DE",
    name: "Deutsch",
    flag: "🇩🇪",
    region: "DE"
  }
] as const

export type LanguageCode = typeof languages[number]["code"] 