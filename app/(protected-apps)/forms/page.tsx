import { Suspense } from "react";
import { getForms } from "@/lib/services/forms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import SuspenseLoading from "@/components/ui/suspense";
import { TransvipLogo } from '@/components/transvip/transvip-logo';
import { OperationsForm } from "@/lib/types/vehicle/forms";
import { Routes } from "@/utils/routes";

export const metadata = {
	title: 'Formularios | Transvip',
	description: 'Responde a los formularios de operaciones en Transvip',
}

export default async function FormulariosPage() {
	const forms = await getForms();
	const activeForms = forms.filter(form => form.is_active);

	return (
		<Suspense fallback={<SuspenseLoading />}>
			<FormulariosContent activeForms={activeForms} baseUrl={Routes.OPERATIONS_FORMS.HOME} />
		</Suspense>
	);
}

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
			<CardContent className="grid gap-4 grid-cols-1 lg:grid-cols-2">
				{activeForms.map((form) => (
					<Link key={form.id} href={`${baseUrl}/${form.id}`} className="block hover:opacity-90">
						<Card className="h-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<ClipboardList className="h-4 w-4 text-transvip" />
									{form.title}
								</CardTitle>
								<CardDescription className="text-xs">{form.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<Button className="w-full bg-transvip hover:bg-transvip/80">
									Responder Formulario
								</Button>
							</CardContent>
						</Card>
					</Link>
				))}

				{activeForms.length === 0 && (
					<div className="col-span-full text-center py-8">
						<p className="text-muted-foreground">No hay formularios disponibles en este momento.</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
