import { Suspense } from "react";
import { getForms } from "@/lib/services/forms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import SuspenseLoading from "@/components/ui/suspense";

export const metadata = {
	title: 'Formularios | Transvip',
	description: 'Responde a los formularios de operaciones en Transvip',
}

export default async function FormulariosPage() {
	return (
		<Suspense fallback={<SuspenseLoading />}>
			<FormulariosContent />
		</Suspense>
	);
}

async function FormulariosContent() {
	const forms = await getForms();
	const activeForms = forms.filter(form => form.is_active);

	return (
		<div className="container mx-auto py-3">
			<div className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight">Formularios Disponibles</h1>
				<p className="text-muted-foreground">
					Selecciona un formulario para comenzar a responderlo
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{activeForms.map((form) => (
					<Card key={form.id} className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<ClipboardList className="h-5 w-5 text-transvip" />
								{form.title}
							</CardTitle>
							<CardDescription>{form.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<Button asChild className="w-full bg-transvip hover:bg-transvip/80">
								<Link href={`/formularios/${form.id}`}>
									Responder Formulario
								</Link>
							</Button>
						</CardContent>
					</Card>
				))}

				{activeForms.length === 0 && (
					<div className="col-span-full text-center py-8">
						<p className="text-muted-foreground">No hay formularios disponibles en este momento.</p>
					</div>
				)}
			</div>
		</div>
	);
}
