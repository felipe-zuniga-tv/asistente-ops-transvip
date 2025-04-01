'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateSystemConfig } from "@/lib/features/admin/actions"
import { ConfigCardContainer } from "@/components/tables/config-card-container"
import { useTransition } from "react"
import { useToast } from "@/hooks/use-toast"

const GEMINI_MODELS = [
	{
		value: "gemini-2.0-flash-exp",
		label: "Gemini 2.0 Flash (Experimental)",
		description: "Modelo balanceado entre velocidad y calidad"
	},
	{
		value: "gemini-2.0-flash-lite-preview-02-05",
		label: "Gemini 2.0 Flash Lite (Preview)",
		description: "Modelo rápido y eficiente, ideal para respuestas cortas"
	},
	{
		value: "gemini-2.0-flash-thinking-exp-01-21",
		label: "Gemini 2.0 Flash Thinking",
		description: "Modelo más potente, ideal para respuestas elaboradas"
	}
] as const

const LANGUAGES = [
	{ value: "es", label: "Español" },
	{ value: "en", label: "English" },
] as const

const formSchema = z.object({
	llm_model_name: z.enum([...GEMINI_MODELS.map(model => model.value)] as [string, ...string[]], {
		required_error: "Por favor selecciona un modelo.",
	}),
	default_language: z.enum([LANGUAGES[0].value, LANGUAGES[1].value], {
		required_error: "Por favor selecciona un idioma.",
	}),
	session_timeout: z.coerce.number()
		.min(15, "El tiempo mínimo es 15 minutos")
		.max(1440, "El tiempo máximo es 24 horas (1440 minutos)")
		.default(60),
})

interface SystemConfigFormProps {
	initialData: {
		llm_model_name: string
		default_language: string
		session_timeout: number
	}
}

export function SystemConfigForm({ initialData }: SystemConfigFormProps) {
	const [isPending, startTransition] = useTransition()
	const { toast } = useToast()
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			llm_model_name: initialData.llm_model_name as typeof GEMINI_MODELS[number]['value'],
			default_language: initialData.default_language as typeof LANGUAGES[number]['value'],
			session_timeout: initialData.session_timeout,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			// Update each config separately
			await Promise.all([
				updateSystemConfig({
					key: 'llm_model_name',
					value: values.llm_model_name,
				}),
				updateSystemConfig({
					key: 'default_language',
					value: values.default_language,
				}),
				updateSystemConfig({
					key: 'session_timeout',
					value: values.session_timeout.toString(),
				}),
			])
			toast({
				title: 'Configuración actualizada exitosamente',
			})
		} catch (error) {
			console.error('Error updating system config:', error)
			toast({
				title: 'Error al actualizar la configuración',
				variant: 'destructive',
			})
		}
	}

	return (
		<ConfigCardContainer
			title="Configuración del Sistema" 
			className="max-w-full"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<FormField
							control={form.control}
							name="llm_model_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>LLM Chatbot</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="h-14">
												<SelectValue placeholder="Selecciona un modelo" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{GEMINI_MODELS.map((model) => (
												<SelectItem key={model.value} value={model.value}>
													<div className="flex flex-col items-start">
														<span>{model.label}</span>
														<span className="text-xs text-muted-foreground">{model.description}</span>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										Selecciona el modelo de lenguaje a utilizar en el chat.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="default_language"
							render={({ field }) => (
								<FormItem className="hidden">
									<FormLabel>Idioma por defecto</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="h-14">
												<SelectValue placeholder="Selecciona un idioma" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{LANGUAGES.map((language) => (
												<SelectItem key={language.value} value={language.value}>
													{language.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										Idioma predeterminado para la interfaz del sistema.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="session_timeout"
							render={({ field }) => (
								<FormItem className="hidden">
									<FormLabel>Tiempo de sesión (minutos)</FormLabel>
									<FormControl>
										<Input
											type="number"
											min={15}
											max={1440}
											step={15}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Tiempo de inactividad antes de cerrar la sesión (entre 15 minutos y 24 horas).
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button type="submit" disabled={form.formState.isSubmitting} className="w-full md:w-auto">
						{form.formState.isSubmitting ? "Guardando..." : "Guardar cambios"}
					</Button>
				</form>
			</Form>
		</ConfigCardContainer>
	)
} 