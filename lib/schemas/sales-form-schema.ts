import { z } from "zod"
import { languages } from "@/lib/i18n/languages"

export const salesFormSchema = z.object({
  language: z.enum([languages[0].code, ...languages.slice(1).map(l => l.code)]),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneCountry: z.string(),
  phoneNumber: z.string().min(6, {
    message: "Phone number must be at least 6 characters.",
  }),
  returnDate: z.date({
    required_error: "Please select a return date.",
  }),
  returnTime: z.string({
    required_error: "Please select a return time.",
  }),
  accommodation: z.string().min(3, {
    message: "Accommodation name must be at least 3 characters.",
  }),
})

export type SalesFormValues = z.infer<typeof salesFormSchema>

export const defaultValues: Partial<SalesFormValues> = {
  language: "en-US",
  phoneCountry: "US",
} 