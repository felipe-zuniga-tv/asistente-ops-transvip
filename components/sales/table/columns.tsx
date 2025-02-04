"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SalesResponse } from "@/lib/types/sales";

const statusColors: Record<SalesResponse['status'], string> = {
	pending: "bg-yellow-100 text-yellow-800",
	contacted: "bg-blue-100 text-blue-800",
	confirmed: "bg-green-100 text-green-800",
	cancelled: "bg-red-100 text-red-800",
};

export const columns: ColumnDef<SalesResponse>[] = [
	{
		accessorKey: "branch_name",
		header: () => <div className="text-center">Sucursal</div>,
		cell: ({ row }) => (
			<div className="text-center">
				{row.getValue("branch_name")}
			</div>
		),
	},
	{
		accessorKey: "created_at",
		header: () => <div className="text-center">Fecha</div>,
		cell: ({ row }) => (
			<div className="text-center">
				{format(new Date(row.getValue("created_at")), 'dd/MM/yyyy HH:mm')}
			</div>
		),
	},
	{
		accessorKey: "customer",
		header: () => <div className="text-center">Cliente</div>,
		cell: ({ row }) => (
			<div className="text-center">
				{`${row.original.first_name} ${row.original.last_name}`}
			</div>
		),
	},
	{
		accessorKey: "contact",
		header: () => <div className="text-center">Contacto</div>,
		cell: ({ row }) => (
			<div className="flex flex-col gap-1 items-center text-center">
				<span>{row.original.phone_country} {row.original.phone_number}</span>
				<span className="text-sm text-gray-500">{row.original.email}</span>
			</div>
		),
	},
	{
		accessorKey: "whatsapp_confirmed",
		header: () => <div className="text-center">WhatsApp</div>,
		cell: ({ row }) => (
			<div className="text-center">
				{row.original.whatsapp_confirmed ? (
					<Badge variant="default" className="gap-1">
						<Check className="h-3 w-3" />
						Confirmado
					</Badge>
				) : (
					<Badge variant="secondary" className="gap-1">
						<X className="h-3 w-3" />
						Pendiente
					</Badge>
				)}
			</div>
		),
	},
	{
		accessorKey: "status",
		header: () => <div className="text-center">Estado</div>,
		cell: ({ row }) => {
			const status = row.getValue("status") as SalesResponse['status'];
			return (
				<div className="text-center">
					<Badge className={statusColors[status]}>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: "notes",
		header: () => <div className="text-center">Notas</div>,
		cell: ({ row, table }) => (
			<div className="text-center">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="ghost" className="h-8">
							{row.original.notes ? 'Ver Notas' : 'Agregar Notas'}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Notas del cliente</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="notes">Notas</Label>
								<Textarea
									id="notes"
									defaultValue={row.original.notes}
									onChange={(e) => (table.options.meta as any).onUpdateNotes(row.original.id, e.target.value)}
									placeholder="Agregar notas sobre el cliente..."
								/>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		),
	},
	{
		id: "actions",
		header: () => <div className="text-center">Acciones</div>,
		cell: ({ row, table }) => {
			return (
				<div className="text-center">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Acciones</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => (table.options.meta as any).onConfirmWhatsapp(row.original.id, !row.original.whatsapp_confirmed)}
							>
								{row.original.whatsapp_confirmed ? 'Desconfirmar WhatsApp' : 'Confirmar WhatsApp'}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => (table.options.meta as any).onUpdateStatus(row.original.id, 'contacted')}
							>
								Marcar como contactado
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => (table.options.meta as any).onUpdateStatus(row.original.id, 'confirmed')}
							>
								Marcar como confirmado
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => (table.options.meta as any).onUpdateStatus(row.original.id, 'cancelled')}
								className="text-red-600"
							>
								Marcar como cancelado
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
]; 