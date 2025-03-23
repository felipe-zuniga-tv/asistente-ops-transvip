"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SidebarSearchProps {
	searchQuery: string
	setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

export function SidebarSearch({ searchQuery, setSearchQuery }: SidebarSearchProps) {
	return (
		<div className="relative bg-white rounded-lg flex items-center m-2">
			<Search className="text-gray-500 size-4 absolute left-2 top-1/2 transform -translate-y-1/2" />
			<Input 
				type="text"
				name="sidebar_search"
				placeholder="Busca tu herramienta..."
				value={searchQuery}
				className="p-3 pl-8 border border-blue-200"
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			{searchQuery && (
				<button
					type="button"
					onClick={() => setSearchQuery("")}
					className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
					aria-label="Clear search"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	)
} 