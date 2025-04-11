'use client'

import { type Branch } from '@/lib/core/types/admin'
import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const columns: ColumnDef<Branch>[] = [
    {
        accessorKey: 'name',
        header: () => <div className="text-center w-[100px]">Nombre</div>,
        cell: ({ row }) => <div className="text-center w-[100px]">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'code',
        header: () => <div className="text-center w-[80px]">Código</div>,
        cell: ({ row }) => <div className="text-center w-[80px]">{row.getValue('code')}</div>,
    },
    {
        accessorKey: 'branch_id',
        header: () => <div className="text-center">ID de Sucursal</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue('branch_id')}</div>,
    },
    {
        accessorKey: 'sales_form_active',
        header: () => <div className="text-center">Formulario de Ventas</div>,
        cell: ({ row }) => {
            const isActive = row.original.sales_form_active
            return (
                <div className="flex justify-center">
                    <Badge
                        variant={isActive ? 'default' : 'secondary'}
                        className={`text-xs ${isActive ? 'bg-green-700 hover:bg-green-800' : 'text-white bg-red-500 hover:bg-red-400'}`}
                    >
                        {isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: 'is_active',
        header: () => <div className="text-center">Estado</div>,
        cell: ({ row }) => {
            const isActive = row.original.is_active
            return (
                <div className="flex justify-center">
                    <Badge
                        variant={isActive ? 'default' : 'secondary'}
                        className={`text-xs ${isActive ? 'bg-green-700 hover:bg-green-800' : 'text-white bg-red-500 hover:bg-red-400'}`}
                    >
                        {isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                </div>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ table, row }) => {
            const branch = row.original
            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => table.options.meta?.onEdit?.(branch)}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => table.options.meta?.onDelete?.(branch)}
                                className="text-destructive hover:text-destructive bg-red-500/10 hover:bg-red-500/20"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Eliminar</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
] 