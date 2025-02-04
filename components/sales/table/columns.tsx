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
	DialogTrigger,
	DialogFooter
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SalesResponse } from "@/lib/types/sales";
import { WhatsappIcon } from "@/components/ui/icons-list";
import React from "react";

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
		accessorKey: "first_name",
		header: () => <div className="text-center">Nombre</div>,
		cell: ({ row }) => (
			<div className="text-center text-sm">
				{row.original.first_name}
			</div>
		),
	},
	{
		accessorKey: "last_name",
		header: () => <div className="text-center">Apellido</div>,
		cell: ({ row }) => (
			<div className="text-center text-sm">
				{row.original.last_name}
			</div>
		),
	},
	{
		accessorKey: "phone_number",
		header: () => <div className="text-center hidden">Teléfono</div>,
		cell: ({ row }) => (
			<div className="hidden flex flex-col gap-1 items-center text-center text-sm">
				<span>{row.original.phone_country} {row.original.phone_number}</span>
			</div>
		),
	},
	{
		accessorKey: "email",
		header: () => <div className="text-center hidden">Email</div>,
		cell: ({ row }) => (
			<div className="hidden text-center text-sm">
				{row.original.email}
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
		accessorKey: "notes",
		header: () => <div className="text-center">Notas</div>,
		cell: ({ row, table }) => {
			const [open, setOpen] = React.useState(false)
			const [notes, setNotes] = React.useState(row.original.notes || '')
			const [isLoading, setIsLoading] = React.useState(false)

			return (
				<div className="text-center">
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button variant="outline" size="sm" className="h-8">
								{row.original.notes ? 'Ver Notas' : 'Agregar Notas'}
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[500px]">
							<DialogHeader>
								<DialogTitle>Notas del Cliente</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label className="text-right font-semibold">Cliente</Label>
									<div className="col-span-3 text-sm">
										{row.original.first_name} {row.original.last_name}
									</div>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label className="text-right font-semibold">Sucursal</Label>
									<div className="col-span-3 text-sm">
										{row.original.branch_name}
									</div>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label className="text-right font-semibold">Teléfono</Label>
									<div className="col-span-3 text-sm">
										{row.original.phone_country} {row.original.phone_number}
									</div>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label className="text-right font-semibold">Notas</Label>
									<Textarea 
										className="col-span-3 text-sm"
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										placeholder="Agregar notas sobre el cliente..."
										disabled={isLoading}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button
									type="submit"
									onClick={async () => {
										try {
											setIsLoading(true);
											await (table.options.meta as any).onUpdateNotes(row.original.id, notes);
											setOpen(false);
										} catch (error) {
											console.error('Error updating notes:', error);
										} finally {
											setIsLoading(false);
										}
									}}
									disabled={isLoading}
								>
									{isLoading ? 'Guardando...' : 'Guardar cambios'}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
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
							<DropdownMenuLabel>Acciones</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => (table.options.meta as any).onConfirmWhatsapp(row.original.id, !row.original.whatsapp_confirmed)}
							>
								<WhatsappIcon className="bg-green-500 rounded-full p-0.5" /> {row.original.whatsapp_confirmed ? 'Desconfirmar WhatsApp' : 'Confirmar WhatsApp'}
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