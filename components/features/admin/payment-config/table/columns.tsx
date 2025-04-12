'use client'

import { type PaymentMethod } from '@/lib/core/types/admin'
import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Trash, icons } from 'lucide-react'
import {
    Badge,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui'
import { cn } from '@/utils/ui'

export const columns: ColumnDef<PaymentMethod>[] = [
    {
        accessorKey: 'payment_id',
        header: () => <div className="text-center w-[80px]">ID Enlace</div>,
        cell: ({ row }) => <div className="text-center w-[80px]">{row.original.payment_id}</div>,
    },
    {
        accessorKey: 'key',
        header: () => <div className="text-center">Ícono</div>,
        cell: ({ row }) => {
            const Icon = (icons[row.original.icon_name as keyof typeof icons] || null) as any
            return Icon ? (
                <div className="flex justify-center">
                    <Icon className="h-4 w-4" />
                </div>
            ) : null
        },
    },
    {
        accessorKey: 'name',
        header: () => <div className="text-center">Nombre</div>,
        cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
    },
    
    {
        accessorKey: 'is_active',
        header: () => <div className="text-center">Estado</div>,
        cell: ({ row }) => {
            const isActive = row.original.is_active
            return (
                <div className="text-center">
                    <Badge
                        variant={isActive ? 'default' : 'secondary'}
                        className={cn("text-xs", isActive ? 'bg-green-700 hover:bg-green-800' : 'text-white bg-red-500 hover:bg-red-400')}
                    >
                        {isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                </div>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row, table }) => {
            const paymentMethod = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => table.options.meta?.onEdit?.(paymentMethod)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => table.options.meta?.onDelete?.(paymentMethod)}
                            className="text-destructive hover:text-destructive bg-red-500/10 hover:bg-red-500/20"
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
] 