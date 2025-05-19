'use client'

import { useState, useEffect } from 'react'
import { SalesResponse } from '@/lib/core/types/sales'
import { SalesResponsesTable } from './sales-responses-table'
import { SalesResponseNotesDialog } from './sales-response-notes-dialog'
import { useToast } from '@/hooks/use-toast'
import { ConfigCardContainer } from '@/components/ui/tables/config-card-container'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSalesResponses } from '@/hooks/features/sales-responses/use-sales-responses'

const WHATSAPP_MESSAGES = {
	'es-CL': "Hola [NAME], te escribimos de Transvip. Este mensaje es sólo para confirmar que obtuvimos correctamente tu número de teléfono. ¡Buen viaje!",
	'en-US': "Hello [NAME], we are writing to you from Transvip. This message is only to confirm that we correctly obtained your phone number. Have a good trip!",
	'pt-BR': "Olá [NAME], estamos escrevendo para você da Transvip. Esta mensagem serve apenas para confirmar que obtivemos corretamente o seu número de telefone. Boa viagem!",
	'de-DE': "Hallo [NAME], wir schreiben Ihnen im Namen von Transvip. Diese Nachricht dient lediglich der Bestätigung, dass wir Ihre Telefonnummer korrekt erhalten haben. Gute Reise!"
};

function getWhatsAppMessage(name: string, language: string): string {
	const message = WHATSAPP_MESSAGES[language as keyof typeof WHATSAPP_MESSAGES] || WHATSAPP_MESSAGES['es-CL'];
	return message.replace("[NAME]", name);
}

function sendWhatsAppMessage(phoneNumber: string, message: string) {
	const encodedMessage = encodeURIComponent(message);
	window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

interface SalesResponsesContentProps {
	initialResponses: SalesResponse[]
	branchName?: string
}

export function SalesResponsesContent({
	initialResponses,
	branchName,
}: SalesResponsesContentProps) {
	const router = useRouter()
	const { toast } = useToast()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editingResponse, setEditingResponse] = useState<SalesResponse | null>(null)

	const {
		responses,
		isLoading: isRefreshing,
		error,
		fetchResponses: loadResponses,
		updateStatus: handleUpdateStatus,
		confirmWhatsapp: handleConfirmWhatsapp,
		updateNotes: handleUpdateNotes,
	} = useSalesResponses({ initialResponses })

	useEffect(() => {
		if (error) {
			toast({
				title: "Error",
				description: error,
				variant: "destructive"
			})
		}
	}, [error, toast])
	
	useEffect(() => {
		if (!isDialogOpen || !editingResponse) {
			const timer = setTimeout(() => {
				document.body.style.pointerEvents = ""
			}, 0)

			return () => clearTimeout(timer)
		} else {
			document.body.style.pointerEvents = "auto"
		}
	}, [isDialogOpen, editingResponse])

	const onUpdateNotes = async (id: string, notes: string) => {
		await handleUpdateNotes(id, notes)
		if (!error) {
			toast({
				title: "Notas actualizadas",
				description: "Las notas han sido actualizadas correctamente."
			})
		}
	}

	const onUpdateStatus = async (id: string, status: string) => {
		await handleUpdateStatus(id, status as SalesResponse['status'])
		if (!error) {
			toast({
				title: "Estado actualizado",
				description: "El estado de la respuesta ha sido actualizado correctamente."
			})
		}
	}
	
	const onConfirmWhatsapp = async (id: string, confirmed: boolean) => {
		await handleConfirmWhatsapp(id, confirmed)
		if (!error) {
			toast({
				title: "WhatsApp confirmado",
				description: `El número de WhatsApp ha sido ${confirmed ? 'confirmado' : 'desconfirmado'} correctamente.`
			})
		}
	}

	const handleEditResponse = (id: string) => {
		const response = responses.find(r => r.id === id)
		if (response) {
			setEditingResponse({ ...response })
			setIsDialogOpen(true)
		}
	}

	const handleDialogClose = () => {
		setIsDialogOpen(false)
		setEditingResponse(null)
		router.refresh()
	}

	const handleSendWhatsAppMessage = (response: SalesResponse) => {
		const message = getWhatsAppMessage(response.first_name.trim(), response.language);
		const phoneNumber = response.country_code ? `${response.country_code}${response.phone_number}` : response.phone_number;
		sendWhatsAppMessage(phoneNumber, message);
	}

	return (
		<ConfigCardContainer title={branchName ? `Respuestas de ${branchName}` : "Respuestas de Formularios"}
			headerContent={
				<Button
					variant="outline"
					size="icon"
					onClick={loadResponses}
					disabled={isRefreshing}
				>
					<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
				</Button>
			}
			className='max-w-full'
		>
			<p className="text-muted-foreground text-sm -mt-6">
				{branchName 
					? `Respuestas a los formularios de ventas para la sucursal ${branchName}`
					: "Respuestas a los formularios de ventas utilizados en los counters"}
			</p>

			<SalesResponsesTable
				data={responses}
				onUpdateStatus={onUpdateStatus}
				onConfirmWhatsapp={onConfirmWhatsapp}
				onUpdateNotes={handleEditResponse}
				onSendWhatsApp={handleSendWhatsAppMessage}
			/>

			<SalesResponseNotesDialog
				open={isDialogOpen}
				onOpenChange={handleDialogClose}
				response={editingResponse}
				onSave={onUpdateNotes}
			/>
		</ConfigCardContainer>
	)
} 