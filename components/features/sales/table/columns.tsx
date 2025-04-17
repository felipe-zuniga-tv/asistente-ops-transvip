"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { X, ChevronDown, ArrowRight } from "lucide-react";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui"
import type { SalesResponse } from "@/lib/core/types/sales";
import { WhatsappIcon } from "@/components/ui/whatsapp-icon";
import { languages } from "../language-selector";
import type { Language } from "@/lib/core/i18n";

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
		onUpdateStatus?: (id: string, status: string) => void | Promise<void>
		onUpdateNotes?: (id: string) => void
		onSendWhatsApp?: (response: TData) => void
	}
}

export const columns: ColumnDef<SalesResponse>[] = [
	// {
	// 	accessorKey: "branch_name",
	// 	header: () => <div className="text-center hidden">Sucursal</div>,
	// 	cell: ({ row }) => (
	// 		<div className="text-center text-sm hidden">
	// 			{row.getValue("branch_name")}
	// 		</div>
	// 	),
	// },
	{
		accessorKey: "created_at",
		header: () => <div className="text-center w-[130px]">Fecha solicitud</div>,
		cell: ({ row }) => (
			<div className="text-center text-sm w-[130px]">
				{format(new Date(row.getValue("created_at")), 'dd/MM/yyyy HH:mm')}
			</div>
		),
	},
	{
		accessorKey: "language",
		header: () => <div className="text-center w-[50px]">Idioma</div>,
		cell: ({ row }) => {
			const lang = languages.find(l => l.value === (row.original.language as Language));
			return (
				<div className="flex items-center justify-center gap-2 text-sm w-[50px]">
					<span className="text-lg">{lang?.flag.split(" ")[0]}</span>
					<span className="hidden">{lang?.label}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "client_name_email",
		header: () => <div className="text-center">Nombre / Teléfono / Email</div>,
		cell: ({ row }) => (
			<div className="text-center flex flex-col items-center gap-1 justify-center">
				<div className="flex flex-row items-center gap-1 justify-center">
					<div className="text-center text-sm">
						{row.original.first_name} {row.original.last_name}
					</div>
					<span>·</span>
					<div className="text-center flex items-center gap-1 justify-center">
						<div className="text-center">{row.original.country_code}</div>
						<div className="text-center">{row.original.phone_number}</div>
					</div>
				</div>
				<div className="text-center text-xs font-semibold">
					{row.original.email}
				</div>
			</div>
		),
	},
	// {
	// 	accessorKey: "client_name",
	// 	header: () => <div className="text-center">Nombre</div>,
	// 	cell: ({ row }) => (
	// 		<div className="text-center text-sm">
	// 			{row.original.first_name} {row.original.last_name}
	// 		</div>
	// 	),
	// },
	// {
	// 	accessorKey: "email",
	// 	header: () => <div className="text-center">Email</div>,
	// 	cell: ({ row }) => (
	// 		<div className="text-center text-sm">
	// 			{row.original.email}
	// 		</div>
	// 	),
	// },
	// {
	// 	accessorKey: "phone_number",
	// 	header: () => <div className="text-center hidden">Teléfono</div>,
	// 	cell: ({ row }) => (
	// 		<div className="text-center flex items-center gap-1 justify-center hidden">
	// 			<div className="text-center">{row.original.country_code}</div>
	// 			<div className="text-center">{row.original.phone_number}</div>
	// 		</div>
	// 	),
	// },
	{
		accessorKey: "accommodation",
		header: () => <div className="text-center w-[220px]">Alojamiento</div>,
		cell: ({ row }) => (
			<div className="text-center text-sm w-[220px] text-wrap">
				{row.original.accommodation || "-"}
			</div>
		),
	},
	{
		accessorKey: "return_datetime",
		header: () => <div className="text-center w-[130px]">Fecha de retorno</div>,
		cell: ({ row }) => (
			<div className="text-center text-sm w-[130px]">
				{row.original.return_date ? format(new Date(row.original.return_date), 'dd/MM/yyyy') : ''}
				{row.original.return_time ? ` ${row.original.return_time.slice(0, 5)}` : ''}
			</div>
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
					className="h-8 px-2 bg-green-600 hover:bg-green-700 shadow"
					onClick={() => table.options.meta?.onSendWhatsApp?.(row.original)}
				>
					<WhatsappIcon className="hidden h-4 w-4" />
					<span className="text-white">Enviar mensaje</span>
					<ArrowRight className="h-4 w-4 text-white" />
				</Button>
			</div>
		),
	},
	// {
	// 	accessorKey: "whatsapp_confirmed",
	// 	header: () => <div className="text-center">WhatsApp</div>,
	// 	cell: ({ row }) => (
	// 		<div className="text-center text-sm">
	// 			{row.original.whatsapp_confirmed ? (
	// 				<Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
	// 					<Check className="h-3 w-3" />
	// 					Confirmado
	// 				</Badge>
	// 			) : (
	// 				<Badge variant="default" className="gap-1 bg-red-500 hover:bg-red-600">
	// 					<X className="h-3 w-3" />
	// 					Pendiente
	// 				</Badge>
	// 			)}
	// 		</div>
	// 	),
	// },
	{
		id: "confirm_whatsapp",
		header: () => <div className="text-center">Confirmar WhatsApp</div>,
		cell: ({ row, table }) => {
			const isConfirmed = row.original.whatsapp_confirmed;

			return (
				<div className="text-center text-sm flex justify-center">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className={`flex items-center gap-2 shadow w-36 ${isConfirmed
										? "bg-yellow-100 text-black hover:bg-yellow-200"
										: "bg-green-600 hover:bg-green-700 text-white hover:text-white"
									}`}
							>
								{isConfirmed ? (
									<>
										<X className="h-4 w-4" />
										<span>Desconfirmar</span>
									</>
								) : (
									<>
										<WhatsappIcon className="h-4 w-4" />
										<span>Confirmar</span>
									</>
								)}
								<ChevronDown className="h-4 w-4 ml-auto" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="flex flex-col gap-1">
							<DropdownMenuItem
								onClick={() => (table.options.meta as any).onConfirmWhatsapp(row.original.id, true)}
								className="bg-green-400 text-white hover:bg-green-500"
							>
								<WhatsappIcon className="h-4 w-4" />
								Confirmar
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => (table.options.meta as any).onConfirmWhatsapp(row.original.id, false)}>
								<X className="h-4 w-4" />
								Desconfirmar
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: () => <div className="text-center">Estado</div>,
		cell: ({ row, table }) => {
			const status = row.getValue("status") as SalesResponse['status'];
			return (
				<div className="text-center text-sm">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className={`${statusColors[status]} shadow text-xs h-8 w-32`}>
								{statusLabels[status]}
								<ChevronDown className="h-4 w-4 ml-auto" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="flex flex-col gap-1">
							<DropdownMenuLabel>Cambiar Estado</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => table.options.meta?.onUpdateStatus?.(row.original.id, 'pending')}
								className={`${statusColors.pending} text-sm`}
							>
								{statusLabels.pending}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => table.options.meta?.onUpdateStatus?.(row.original.id, 'contacted')}
								className={`${statusColors.contacted} text-sm`}
							>
								{statusLabels.contacted}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => table.options.meta?.onUpdateStatus?.(row.original.id, 'confirmed')}
								className={`${statusColors.confirmed} text-sm`}
							>
								{statusLabels.confirmed}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => table.options.meta?.onUpdateStatus?.(row.original.id, 'cancelled')}
								className={`${statusColors.cancelled} text-sm`}
							>
								{statusLabels.cancelled}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
	// {
	// 	id: "actions",
	// 	header: () => <div className="text-center">Acciones</div>,
	// 	cell: ({ row, table }) => {
	// 		return (
	// 			<div className="text-center">
	// 				<DropdownMenu>
	// 					<DropdownMenuTrigger asChild>
	// 						<Button variant="ghost" className="h-8 w-8 p-0">
	// 							<MoreHorizontal className="h-4 w-4" />
	// 						</Button>
	// 					</DropdownMenuTrigger>
	// 					<DropdownMenuContent align="end">
	// 						<DropdownMenuLabel>Notas</DropdownMenuLabel>
	// 						<DropdownMenuItem
	// 							onClick={() => (table.options.meta as any).onUpdateNotes(row.original.id)}
	// 						>
	// 							{row.original.notes ? (
	// 								<>
	// 									<Pencil className="mr-1 h-4 w-4" />
	// 									Editar nota
	// 								</>
	// 							) : (
	// 								<>
	// 									<PlusCircle className="mr-1 h-4 w-4" />
	// 									Agregar nota
	// 								</>
	// 							)}
	// 						</DropdownMenuItem>
	// 					</DropdownMenuContent>
	// 				</DropdownMenu>
	// 			</div>
	// 		);
	// 	},
	// },
]; 