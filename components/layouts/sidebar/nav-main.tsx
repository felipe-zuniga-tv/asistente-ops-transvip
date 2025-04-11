"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui"
import Link from "next/link"
import { SidebarItem } from "@/components/features/chat/panel/types"

export function NavMain({ title, items, handleClick, showHints }: {
	title?: string
	items: SidebarItem[]
	handleClick: any
	showHints: boolean
}) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>{title || "Operaciones Transvip"}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.active}
						className='group/collapsible'
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
									<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.map((subItem) => (
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
