"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Check, X, PlusCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import type { SalesResponse } from "@/lib/types/sales";
import { WhatsappIcon } from "@/components/ui/icons-list";
import React from "react";
import { languages } from "../language-selector";
import type { Language } from "@/lib/translations";

const statusColors: Record<SalesResponse['status'], string> = {
	pending: "bg-yellow-100 text-black hover:bg-yellow-200 hover:text-black",
	contacted: "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-800",
	confirmed: "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800",
	cancelled: "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-800",
};

export const statusLabels: Record<SalesResponse['status'], string> = {
	pending: "Pendiente",
	contacted: "Contactado",
	confirmed: "Confirmado",
	cancelled: "Cancelado",
};

declare module '@tanstack/table-core' {
	interface TableMeta<TData extends unknown> {
		onConfirmWhatsapp?: (id: string, confirmed: boolean) => void
		onUpdateStatus?: (id: string) => void | Promise<void>
		onUpdateNotes?: (id: string) => void
		onSendWhatsApp?: (response: TData) => void
	}
}

export const columns: ColumnDef<SalesResponse>[] = [
	{
		accessorKey: "branch_name",
		header: () => <div className="text-center">Sucursal</div>,
		cell: ({ row }) => (
			<div className="text-center text-sm">
				{row.getValue("branch_name")}
			</div>
		),
	},
	{
		accessorKey: "created_at",
		header: () => <div className="text-center">Fecha</div>,
		cell: ({ row }) => (
			<div className="text-center text-sm">
				{format(new Date(row.getValue("created_at")), 'dd/MM/yyyy HH:mm')}
			</div>
		),
	},
	{
		accessorKey: "client_name",
		header: () => <div className="text-center">Nombre</div>,
		cell: ({ row }) => (
			<div className="text-center text-sm">
				{row.original.first_name} {row.original.last_name}
			</div>
		),
	},
	{
		accessorKey: "language",
		header: () => <div className="text-center">Idioma</div>,
		cell: ({ row }) => {
			const lang = languages.find(l => l.value === (row.original.language as Language));
			return (
				<div className="flex items-center justify-center gap-2 text-sm">
					<span className="text-lg">{lang?.flag.split(" ")[0]}</span>
					<span className="hidden">{lang?.label}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "email",
		header: () => <div className="text-center">Email</div>,
		cell: ({ row }) => (
			<div className="text-center text-sm">
				{row.original.email}
			</div>
		),
	},
	{
		accessorKey: "phone_number",
		header: () => <div className="text-center hidden">Teléfono</div>,
		cell: ({ row }) => (
			<div className="text-center hidden">{row.original.phone_number}</div>
		),
	},
	{
		accessorKey: "send_whatsapp",
		header: () => <div className="text-center">Enviar WhatsApp</div>,
		cell: ({ row, table }) => (
			<div className="text-center">
				<Button
					variant="ghost"
					size="sm"
					className="h-6 px-2 bg-green-600 hover:bg-green-700"
					onClick={() => table.options.meta?.onSendWhatsApp?.(row.original)}
				>
					<WhatsappIcon className="h-4 w-4" />
					<span className="text-white">Enviar mensaje</span>
				</Button>
			</div>
		),
	},
	{
		accessorKey: "whatsapp_confirmed",
		header: () => <div className="text-center">WhatsApp</div>,
		cell: ({ row }) => (
			<div className="text-center text-sm">
				{row.original.whatsapp_confirmed ? (
					<Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
						<Check className="h-3 w-3" />
						Confirmado
					</Badge>
				) : (
					<Badge variant="default" className="gap-1 bg-red-500 hover:bg-red-600">
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
				<div className="text-center text-sm">
					<Badge className={statusColors[status]}>
						{statusLabels[status]}
					</Badge>
				</div>
			);
		},
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
							<DropdownMenuLabel>Notas</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => (table.options.meta as any).onUpdateNotes(row.original.id)}
							>
								{row.original.notes ? (
									<>
										<Pencil className="mr-1 h-4 w-4" />
										Editar nota
									</>
								) : (
									<>
										<PlusCircle className="mr-1 h-4 w-4" />
										Agregar nota
									</>
								)}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuLabel>Estado</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => (table.options.meta as any).onConfirmWhatsapp(row.original.id, !row.original.whatsapp_confirmed)}
							>
								<WhatsappIcon className="mr-1 bg-green-500 rounded-full p-0.5" /> {row.original.whatsapp_confirmed ? 'Desconfirmar WhatsApp' : 'Confirmar WhatsApp'}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => (table.options.meta as any).onUpdateStatus(row.original.id)}
							>
								Marcar como contactado
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => (table.options.meta as any).onUpdateStatus(row.original.id)}
							>
								Marcar como confirmado
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => (table.options.meta as any).onUpdateStatus(row.original.id)}
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