'use client'

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"

interface DataTableSearchProps<TData> {
    table: Table<TData>
    placeholder?: string
    searchColumnId?: string
}

export function DataTableSearch<TData>({
    table,
    placeholder = "Buscar...",
    searchColumnId = "name"
}: DataTableSearchProps<TData>) {
    return (
        <div className="flex items-center">
            <div className="flex items-center border rounded-md px-3 gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={placeholder}
                    value={(table.getColumn(searchColumnId)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(searchColumnId)?.setFilterValue(event.target.value)
                    }
                    className="w-[200px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                />
            </div>
        </div>
    )
} 