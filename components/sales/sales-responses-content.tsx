'use client'

import { useState } from 'react'
import { SalesResponse } from '@/lib/types/sales'
import { SalesResponsesTable } from './sales-responses-table'
import { useToast } from '@/hooks/use-toast'
import { ConfigCardContainer } from '@/components/tables/config-card-container'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import {
	updateSalesResponseStatusAction,
	updateSalesResponseWhatsappConfirmationAction,
	updateSalesResponseNotesAction,
	getSalesResponses
} from '@/lib/services/sales'

interface SalesResponsesContentProps {
	initialResponses: SalesResponse[]
}

export function SalesResponsesContent({
	initialResponses,
}: SalesResponsesContentProps) {
	const { toast } = useToast()
	const [responses, setResponses] = useState<SalesResponse[]>(initialResponses)
	const [isRefreshing, setIsRefreshing] = useState(false)

	const loadResponses = async () => {
		try {
			setIsRefreshing(true)
			const data = await getSalesResponses()
			setResponses(data)
		} catch (error) {
			toast({
				title: "Error",
				description: "There was an error loading the responses.",
				variant: "destructive"
			})
		} finally {
			setIsRefreshing(false)
		}
	}

	const handleUpdateStatus = async (id: string, status: SalesResponse['status']) => {
		try {
			await updateSalesResponseStatusAction(id, status)
			await loadResponses()
			toast({
				title: "Status updated",
				description: "The response status has been updated successfully."
			})
		} catch (error) {
			toast({
				title: "Error",
				description: "There was an error updating the status.",
				variant: "destructive"
			})
		}
	}

	const handleConfirmWhatsapp = async (id: string, confirmed: boolean) => {
		try {
			await updateSalesResponseWhatsappConfirmationAction(id, confirmed)
			await loadResponses()
			toast({
				title: "WhatsApp status updated",
				description: `WhatsApp number has been ${confirmed ? 'confirmed' : 'unconfirmed'} successfully.`
			})
		} catch (error) {
			toast({
				title: "Error",
				description: "There was an error updating the WhatsApp confirmation status.",
				variant: "destructive"
			})
		}
	}

	const handleUpdateNotes = async (id: string, notes: string) => {
		try {
			await updateSalesResponseNotesAction(id, notes)
			await loadResponses()
			toast({
				title: "Notes updated",
				description: "The notes have been updated successfully."
			})
		} catch (error) {
			toast({
				title: "Error",
				description: "There was an error updating the notes.",
				variant: "destructive"
			})
		}
	}

	return (
		<ConfigCardContainer title="Respuestas de Formularios"
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
			<p className="text-muted-foreground text-sm -mt-4">
				Respuestas a los formularios de ventas para los counter.
			</p>

			<SalesResponsesTable
				data={responses}
				onUpdateStatus={handleUpdateStatus}
				onConfirmWhatsapp={handleConfirmWhatsapp}
				onUpdateNotes={handleUpdateNotes}
			/>
		</ConfigCardContainer>
	)
} 