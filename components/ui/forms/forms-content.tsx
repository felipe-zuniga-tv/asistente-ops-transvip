import Link from "next/link";
import { 
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
 } from "@/components/ui";
import { ClipboardList } from "lucide-react";
import { TransvipLogo } from "@/components/features/transvip/transvip-logo";
import type { OperationsForm } from "@/types/domain/forms/types";

export async function FormulariosContent({ activeForms, baseUrl }: {
	activeForms: OperationsForm[]
	baseUrl: string
}) {
	return (
		<Card className="max-w-6xl mx-2 mt-4 lg:mx-auto">
			<CardHeader>
				<CardTitle>
					<div className="flex flex-row items-center gap-2">
						<TransvipLogo size={20} />
						<span>Formularios Disponibles</span>
					</div>
				</CardTitle>
				<CardDescription>
					Selecciona un formulario para comenzar a responderlo
				</CardDescription>
			</CardHeader>
			<CardContent className={`grid gap-4 ${activeForms.length > 1 ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
				{activeForms.map((form) => (
					<Link key={form.id} href={`${baseUrl}/${form.id}`} className="block hover:opacity-90">
						<Card className="h-full">
							<CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 space-y-0">
								<div className="w-full flex flex-col items-center md:items-start gap-0">
									<CardTitle className="flex items-center gap-2 text-lg">
										<ClipboardList className="h-4 w-4 text-transvip" />
										{form.title}
									</CardTitle>
									<CardDescription className="text-xs">{form.description}</CardDescription>
								</div>
								<Button className="w-fit px-6 bg-transvip hover:bg-transvip/80">
									Responder Formulario
								</Button>
							</CardHeader>
						</Card>
					</Link>
				))}

				{activeForms.length === 0 && (
					<div className="col-span-full text-center py-8">
						<p className="text-muted-foreground">No hay formularios disponibles en este momento.</p>
					</div>
				)}
			</CardContent>
		</Card >
	);
}
