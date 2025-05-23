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
import { SidebarItem, SidebarSection } from "@/components/features/chat/panel/types"

interface PublicSectionProps {
	section: SidebarSection
	items: SidebarItem[]
	handleClick: (item: SidebarItem) => Promise<void>
}

// Rotate through different subtle background colors
const bgColors = [
	"bg-green-50/90 hover:bg-green-100/90",
	"bg-blue-50/90 hover:bg-blue-100/90",
	"bg-purple-50/90 hover:bg-purple-100/90",
	"bg-pink-50/90 hover:bg-pink-100/90",
	"bg-indigo-50/90 hover:bg-indigo-100/90",
	"bg-cyan-50/90 hover:bg-cyan-100/90",
]

export function PublicSection({ section, items, handleClick }: PublicSectionProps) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>{section.title}</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item, index) => {
						const bgColor = bgColors[index % bgColors.length]

						return (
							<SidebarMenuItem key={item.title} className={`bg-transparent`}>
								{item.url ? (
									<SidebarMenuButton 
										asChild 
										isActive={item.active}
										tooltip={item.title}
										className={`${bgColor} transition-colors shadow`}
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
										className={`${bgColor} transition-colors shadow`}
										onClick={() => handleClick(item)}
									>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</SidebarMenuButton>
								)}
							</SidebarMenuItem>
						)
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
} 