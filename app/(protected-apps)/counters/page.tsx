'use client'

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { WhatsappIcon } from "@/components/ui/icons-list";

interface BookingRequest {
	fecha: string;
	idioma: string;
	nombre: string;
	apellido: string;
	email: string;
	codigoPais: string;
	telefono: string;
	fechaRetorno: string;
	horaRetorno: string;
	ubicacion: string;
}

const WHATSAPP_MESSAGES = {
	es: "Hola [Nombre], te escribimos de Transvip. Este mensaje es sólo para confirmar que obtuvimos correctamente tu número de teléfono. ¡Buen viaje!",
	en: "Hello [Name], we are writing to you from Transvip. This message is only to confirm that we correctly obtained your phone number. Have a good trip!",
	pt: "Olá [Nome], estamos escrevendo para você da Transvip. Esta mensagem serve apenas para confirmar que obtivemos corretamente o seu número de telefone. Boa viagem!",
	de: "Hallo [Name], wir schreiben Ihnen im Namen von Transvip. Diese Nachricht dient lediglich der Bestätigung, dass wir Ihre Telefonnummer korrekt erhalten haben. Gute Reise!"
};

function getWhatsAppMessage(name: string, language: string): string {
	const message = WHATSAPP_MESSAGES[language as keyof typeof WHATSAPP_MESSAGES] || WHATSAPP_MESSAGES.es;
	return message.replace("[Nombre]", name).replace("[Name]", name);
}

function sendWhatsAppMessage(phoneNumber: string, message: string) {
	const encodedMessage = encodeURIComponent(message);
	window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

export default function CountersPage() {
	// This data would come from your backend/database
	const bookingRequests: BookingRequest[] = [
		{
			fecha: "2024-10-03 12:11:16",
			idioma: "es",
			nombre: "Alejandra",
			apellido: "millaray",
			email: "alejandrabenitezb33@gmail.com",
			codigoPais: "56",
			telefono: "982971008",
			fechaRetorno: "2024-10-24",
			horaRetorno: "12:10",
			ubicacion: "La casa de don Tomás"
		},
		// ... more booking requests
	];

	return (
		<div className="container mx-auto py-6">
			<Card>
				<CardHeader>
					<CardTitle>Solicitudes de Reserva</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Fecha</TableHead>
									<TableHead>Nombre</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Teléfono</TableHead>
									<TableHead>Retorno</TableHead>
									<TableHead>Ubicación</TableHead>
									<TableHead>Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{bookingRequests.map((booking, index) => (
									<TableRow key={index}>
										<TableCell>{format(new Date(booking.fecha), 'dd/MM/yyyy HH:mm')}</TableCell>
										<TableCell>{`${booking.nombre} ${booking.apellido}`}</TableCell>
										<TableCell>{booking.email}</TableCell>
										<TableCell>{`+${booking.codigoPais}${booking.telefono}`}</TableCell>
										<TableCell>{`${format(new Date(booking.fechaRetorno), 'dd/MM/yyyy')} ${booking.horaRetorno}`}</TableCell>
										<TableCell>{booking.ubicacion}</TableCell>
										<TableCell>
											<Button
												variant="default"
												size="sm"
												onClick={() => {
													const message = getWhatsAppMessage(booking.nombre, booking.idioma);
													sendWhatsAppMessage(`${booking.codigoPais}${booking.telefono}`, message);
												}}
											>
												<WhatsappIcon />
												Confirmar WhatsApp
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
