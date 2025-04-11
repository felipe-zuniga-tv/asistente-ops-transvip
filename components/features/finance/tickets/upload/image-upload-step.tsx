import { UseFormReturn } from "react-hook-form"
import { ImageIcon, Loader2 } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TicketImagePreview } from "./ticket-image-preview"
import { ImageUploadValues } from "./schemas"

interface ImageUploadStepProps {
	form: UseFormReturn<ImageUploadValues>
	imagePreview?: string
	onSubmit: (values: ImageUploadValues) => Promise<void>
	onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onRemoveImage: () => void
	isProcessing: boolean
}

export function ImageUploadStep({
	form,
	imagePreview,
	onSubmit,
	onImageChange,
	onRemoveImage,
	isProcessing
}: ImageUploadStepProps) {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<FormField
					control={form.control}
					name="image"
					render={({ field: { onChange, value, ...field } }) => (
						<FormItem>
							<FormLabel>Imagen del Ticket</FormLabel>
							<FormControl>
								<div className="border border-dashed rounded-lg p-8">
									{imagePreview ? (
										<div className="flex justify-center items-center">
											<TicketImagePreview
												imageUrl={imagePreview}
												onRemove={onRemoveImage}
											/>
										</div>
									) : (
										<div className="flex flex-col items-center gap-4">
											<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
												<ImageIcon className="h-6 w-6" />
											</div>
											<div className="space-y-1 text-center">
												<p className="text-sm text-muted-foreground">
													Sube tu imagen del ticket de estacionamiento
												</p>
												<p className="text-xs text-muted-foreground">
													PNG, JPG o JPEG (máx. 10MB)
												</p>
											</div>
											<Input
												id="image"
												type="file"
												accept="image/png,image/jpeg"
												className="hidden"
												onChange={onImageChange}
												disabled={isProcessing}
												{...field}
											/>
											<Button
												type="button"
												className="bg-transvip hover:bg-transvip/80 text-white"
												onClick={() => document.getElementById('image')?.click()}
												disabled={isProcessing}
											>
												Seleccionar Imagen
											</Button>
										</div>
									)}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-3/4 md:w-1/2 mx-auto" disabled={isProcessing || !imagePreview}>
					{isProcessing ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Procesando Imagen...
						</>
					) : (
						"Procesar Imagen"
					)}
				</Button>
			</form>
		</Form>
	)
} 