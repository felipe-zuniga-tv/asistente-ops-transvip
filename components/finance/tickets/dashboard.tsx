'use client'

import { EmptyState } from "@/components/ui/empty-state"
import { ConfigCardContainer } from "@/components/tables/config-card-container"
import { columns } from "@/components/finance/tickets/table/columns"
import { ParkingTicketsDataTable } from "@/components/finance/tickets/table/parking-tickets-data-table"
import UploadButton from "@/components/finance/tickets/upload/ticket-upload-button"
import { ParkingTicket } from "@/types"

interface TicketsDashboardProps {
  tickets: ParkingTicket[]
}

export function TicketsDashboard({ tickets }: TicketsDashboardProps) {
  return (
    <ConfigCardContainer
      title="Tickets de Estacionamiento"
      className="w-full max-w-full mx-0"
      headerContent={
        <UploadButton />
      }
    >
      {tickets.length > 0 ? (
        <ParkingTicketsDataTable
          data={tickets}
          columns={columns}
          initialPageSize={5}
        />
      ) : (
        <EmptyState
          title="No hay tickets aún"
          description="Envía tu primer ticket de estacionamiento para empezar"
        />
      )}
    </ConfigCardContainer>
  )
} 