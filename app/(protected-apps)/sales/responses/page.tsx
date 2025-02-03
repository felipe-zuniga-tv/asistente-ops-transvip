'use client'

import { SalesResponsesTable } from "@/components/sales/sales-responses-table"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/hooks/use-auth"
import {
  getSalesResponsesByBranch,
  updateSalesResponseNotes,
  updateSalesResponseStatus,
  updateSalesResponseWhatsappConfirmation
} from "@/lib/services/sales"
import { SalesResponse } from "@/lib/types/sales"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export default function SalesResponsesPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { session } = useAuth()
  const branchCode = session?.user?.branch_code

  const { data: responses, isLoading } = useQuery({
    queryKey: ['sales-responses', branchCode],
    queryFn: () => getSalesResponsesByBranch(branchCode as string),
    enabled: !!branchCode
  })

  const handleUpdateStatus = async (id: string, status: SalesResponse['status']) => {
    try {
      await updateSalesResponseStatus(id, status)
      await queryClient.invalidateQueries({ queryKey: ['sales-responses'] })
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
      await updateSalesResponseWhatsappConfirmation(id, confirmed, session?.user?.id as string)
      await queryClient.invalidateQueries({ queryKey: ['sales-responses'] })
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
      await updateSalesResponseNotes(id, notes)
      await queryClient.invalidateQueries({ queryKey: ['sales-responses'] })
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Responses</h1>
          <p className="text-muted-foreground">
            Manage and track customer responses from the sales form.
          </p>
        </div>
        
        <SalesResponsesTable
          data={responses || []}
          onUpdateStatus={handleUpdateStatus}
          onConfirmWhatsapp={handleConfirmWhatsapp}
          onUpdateNotes={handleUpdateNotes}
        />
      </div>
    </div>
  )
} 