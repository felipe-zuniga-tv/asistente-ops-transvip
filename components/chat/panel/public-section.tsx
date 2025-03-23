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
							{item.url ? (
								<SidebarMenuButton 
									asChild 
									isActive={item.active}
									tooltip={item.title}
									className={section.highlight ? "bg-transvip/20 hover:bg-transvip/30" : ""}
								>
									<Link href={item.url}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							) : (
								<SidebarMenuButton 
									tooltip={item.title}
									isActive={item.active}
									className={section.highlight ? "bg-transvip/20 hover:bg-transvip/30" : ""}
									onClick={() => handleClick(item)}
								>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</SidebarMenuButton>
							)}
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
} 