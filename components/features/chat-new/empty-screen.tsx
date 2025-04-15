'use client';

import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
import { ChatSession } from '@/types/domain/chat';

export function EmptyScreen({ session }: { session: ChatSession }) {
	const exampleMessages = [
		{
			heading: 'Consulta sobre turnos',
			message: '¿Cuáles son los próximos turnos disponibles?'
		},
		{
			heading: 'Información de reservas',
			message: '¿Cómo puedo ver el estado de mis reservas actuales?'
		},
		{
			heading: 'Ayuda con sistema',
			message: 'Explícame cómo usar el sistema de gestión de operaciones'
		},
		{
			heading: 'Reporte de incidentes',
			message: '¿Cómo puedo reportar un incidente durante mi turno?'
		},
		{
			heading: 'Estadísticas de servicio',
			message: '¿Cuáles son las estadísticas de servicio de este mes?'
		},
		{
			heading: 'Cambio de turno',
			message: '¿Cuál es el procedimiento para solicitar un cambio de turno?'
		},
		{
			heading: 'Mantenimiento vehicular',
			message: '¿Cuándo está programado el próximo mantenimiento para mi vehículo?'
		},
		{
			heading: 'Solicitud de vacaciones',
			message: '¿Cómo puedo solicitar mis días de vacaciones en el sistema?'
		}
	];

	return (
		<div className="w-full rounded-lg p-4 flex flex-col items-start gap-2">
			<span className="text-lg font-semibold">
				¡Bienvenido al Asistente de Operaciones Transvip, {session.user.full_name}!
			</span>
			<p className="text-sm text-muted-foreground">
				Este asistente está diseñado para ayudarte con consultas sobre operaciones, turnos, reservas y otras funciones del sistema.
			</p>

			<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
				{exampleMessages.map((message, index) => (
					<Button
						key={index}
						variant="link"
						className="h-auto p-0 text-base"
						onClick={() => {
							const textarea = document.querySelector('textarea');
							if (textarea) {
								textarea.value = message.message;
								textarea.focus();
							}
						}}
					>
						<span className="flex items-center">
							<ExternalLinkIcon className="mr-2 size-3" />
							{message.heading}
						</span>
					</Button>
				))}
			</div>
		</div>
	);
} 