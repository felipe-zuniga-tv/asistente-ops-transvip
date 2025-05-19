import { useState, useCallback } from 'react'
import type { SalesResponse } from '@/lib/core/types/sales'
import {
  getSalesResponses,
  updateSalesResponseStatusAction,
  updateSalesResponseWhatsappConfirmationAction,
  updateSalesResponseNotesAction,
} from '@/lib/features/sales'

interface UseSalesResponsesOptions {
  initialResponses?: SalesResponse[]
}

export function useSalesResponses({ initialResponses = [] }: UseSalesResponsesOptions = {}) {
  const [responses, setResponses] = useState<SalesResponse[]>(initialResponses)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchResponses = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getSalesResponses()
      setResponses(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar las respuestas.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: SalesResponse['status']) => {
    setIsLoading(true)
    setError(null)
    try {
      await updateSalesResponseStatusAction(id, status)
      await fetchResponses()
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado.')
    } finally {
      setIsLoading(false)
    }
  }, [fetchResponses])

  const confirmWhatsapp = useCallback(async (id: string, confirmed: boolean) => {
    setIsLoading(true)
    setError(null)
    try {
      await updateSalesResponseWhatsappConfirmationAction(id, confirmed)
      await fetchResponses()
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la confirmación de WhatsApp.')
    } finally {
      setIsLoading(false)
    }
  }, [fetchResponses])

  const updateNotes = useCallback(async (id: string, notes: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await updateSalesResponseNotesAction(id, notes)
      await fetchResponses()
    } catch (err: any) {
      setError(err.message || 'Error al actualizar las notas.')
    } finally {
      setIsLoading(false)
    }
  }, [fetchResponses])

  return {
    responses,
    isLoading,
    error,
    fetchResponses,
    updateStatus,
    confirmWhatsapp,
    updateNotes,
    setResponses, // for local optimistic updates if needed
  }
}
