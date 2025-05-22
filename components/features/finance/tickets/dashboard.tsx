'use client'

import { EmptyState } from "@/components/ui/empty-state"
import { ConfigCardContainer } from "@/components/ui/tables/config-card-container"
import { columns } from "@/components/features/finance/tickets/table/columns"
import { ParkingTicketsDataTable } from "@/components/features/finance/tickets/table/parking-tickets-data-table"
import UploadButton from "@/components/features/finance/tickets/upload/ticket-upload-button"
import type { ParkingTicket } from "@/types/domain/tickets/types"

export function TicketsDashboard({ tickets }: { tickets: ParkingTicket[] }) {
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