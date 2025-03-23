"use client"

import * as React from "react"
import Link from "next/link"
import { 
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton
} from "@/components/ui/sidebar"
import { SidebarItem, SidebarSection } from "./types"

interface PublicSectionProps {
	section: SidebarSection
	items: SidebarItem[]
	handleClick: (item: SidebarItem) => Promise<void>
}

export function PublicSection({ section, items, handleClick }: PublicSectionProps) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>{section.title}</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton 
								asChild 
								isActive={item.active} 
								className={section.highlight ? "bg-transvip/20 hover:bg-transvip/30" : ""}
							>
								{item.url ? (
									<Link href={item.url}>
										<div className="flex items-center">
											{item.icon && <item.icon className="mr-2 size-4" />}
											<span>{item.title}</span>
										</div>
									</Link>
								) : (
									<div onClick={() => handleClick(item)} className="cursor-pointer flex items-center">
										{item.icon && <item.icon className="mr-2 size-4" />}
										<span>{item.title}</span>
									</div>
								)}
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
} 