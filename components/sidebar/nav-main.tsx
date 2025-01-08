"use client"

import { ChevronRight, Search, type LucideIcon } from "lucide-react"
import { useState } from "react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Tool } from "@/lib/chat/types"
import { Input } from "../ui/input";

export function NavMain({ items, handleClick, showHints }: {
	items: {
		title: string
		url?: string
		href?: string
		icon?: LucideIcon
		isActive?: boolean
		items?: Tool[]
	}[]
	handleClick: any
	showHints: boolean
}) {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredItems = items.filter(item => {
		const isItemMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
		const hasMatchingSubItems = item.items?.some(subItem => 
			subItem.title.toLowerCase().includes(searchQuery.toLowerCase())
		);
		return isItemMatch || (hasMatchingSubItems && item.isActive);
	});

	return (
		<SidebarGroup>
			<div className="relative bg-gray-100 rounded-lg flex items-center m-2 mt-0">
				<Search className="text-gray-500 size-4 absolute left-2 top-1/2 transform -translate-y-1/2" />
				<Input type="text"
					placeholder="Filtra..."
					value={searchQuery}
					className="p-3 pl-8 border border-blue-200 group-data-[state=open]/collapsible"
					onChange={(e: any) => setSearchQuery(e.target.value)}
				/>
			</div>

			<SidebarGroupLabel>Operaciones Transvip</SidebarGroupLabel>
			<SidebarMenu>
				{filteredItems.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.isActive}
						className='group/collapsible'
					>
						<SidebarMenuItem>
							{/* <CollapsibleTrigger asChild className={cn(item.title === chatbotItem.title ? 'bg-slate-500 text-white rounded-lg' : '')}> */}
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
									<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.filter(subItem => 
										subItem.title.toLowerCase().includes(searchQuery.toLowerCase())
									).map((subItem) => (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton asChild className="h-fit min-h-6">
												{subItem.url ? (
													<Link href={subItem.url} aria-disabled={!subItem.active}>
														{subItem.icon && <subItem.icon />}
														<span>{subItem.title}</span>
													</Link>
												) : (
													<div onClick={() => handleClick(subItem)} className="cursor-pointer">
														<div className="flex flex-row gap-2 items-center">
															{subItem.icon && <subItem.icon className="size-4" />}
															<div className="flex flex-col gap-0.5 items-start justify-start">
																<span>{subItem.title}</span>
																{ showHints && <span className="text-xs text-gray-400">{subItem.hint}</span> }
															</div>
														</div>
													</div>
												)}
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
