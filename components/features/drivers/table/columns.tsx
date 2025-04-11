"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Driver } from "../types"
import { cn } from '@/lib/utils/ui'

export const columns: ColumnDef<Driver>[] = [
	{
		accessorKey: "branch_name",
		header: () => <div className="text-center">Sucursal</div>,
		cell: ({ row }) => (
			<div className="text-center">
				{row.original.branch_name}
			</div>
		),
	},
	{
		id: "avatar",
		header: "",
		cell: ({ row }) => {
			const driver = row.original
			return (
				<div className="flex justify-center">
					<Avatar className="h-8 w-8">
						<AvatarImage src={driver.fleet_thumb_image} alt={driver.first_name} />
						<AvatarFallback>{driver.first_name.charAt(0)}</AvatarFallback>
					</Avatar>
				</div>
			)
		},
	},
	{
		id: "name",
		accessorFn: (row) => `${row.first_name} ${row.last_name}`,
		header: () => <div className="text-center">Nombre</div>,
		cell: ({ row }) => (
			<div className="text-center">
				{row.original.first_name} {row.original.last_name}
			</div>
		),
	},
	{
		id: "phone",
		accessorFn: (row) => `${row.country_code}${row.phone}`,
		header: () => <div className="text-center">Teléfono</div>,
		cell: ({ row }) => (
			<div className="font-mono text-center">
				{row.original.country_code} {row.original.phone}
			</div>
		),
	},
	{
		accessorKey: "is_active",
		header: () => <div className="text-center">Estado</div>,
		cell: ({ row }) => {
			const isActive = row.original.is_active
			return (
				<div className="flex justify-center">
					<Badge variant={isActive ? "default" : "destructive"} 
						className={cn(isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600", "cursor-pointer")}>
						{isActive ? "Activo" : "Inactivo"}
					</Badge>
				</div>
			)
		},
	},
	{
		id: "actions",
		header: () => <div className="text-center hidden">Acciones</div>,
		cell: ({ row }) => {
			const driver = row.original
			return (
				<div className="text-center hidden">
					<Link href={`/conductores/${driver.fleet_id}`}
						className="text-blue-600 hover:text-blue-900"
					>
						Ver Perfil
					</Link>
				</div>
			)
		},
	},
] 