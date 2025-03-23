"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { BotMessageSquare } from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarRail,
} from "@/components/ui/sidebar"
import { Routes } from "@/utils/routes"
import { sidebarData, chatbotMenu, publicSidebar } from "@/lib/core/config/chat-sidebar"
import { SidebarSearch } from "./sidebar-search"
import { PublicSection } from "./public-section"
import { useSidebarActions } from "@/components/chat/panel/use-sidebar-actions"
import { SidebarItem, Tool } from "@/components/chat/panel/types"

// Main sidebar component
export function AppSidebar({ 
	session, 
	...props 
}: { 
	session: any 
} & React.ComponentProps<typeof Sidebar>) {
	const path = usePathname()
	const isChatRoute = path === Routes.CHAT
	const [searchQuery, setSearchQuery] = React.useState("")
	const { handleItemClick } = useSidebarActions()

	// Chatbot configuration
	const showHints = false
	const chatbotElement = {
		title: chatbotMenu.title,
		url: "#",
		icon: chatbotMenu.icon,
		active: true,
		items: [
			{
				title: "Accede a Jarvip",
				url: Routes.CHAT,
				icon: BotMessageSquare,
				active: true
			}
		]
	}

	// Get the public section
	const publicSection = isChatRoute ? publicSidebar : publicSidebar
	
	// Get the remaining sections (chatbot and others)
	const remainingSections = isChatRoute
		? [chatbotMenu, ...sidebarData.navMain.filter(
			item => item.title !== publicSidebar.title && item.title !== chatbotMenu.title
		)]
		: [chatbotElement, ...sidebarData.navMain.filter(
			item => item.title !== publicSidebar.title && item.title !== chatbotMenu.title
		)]

	// Filter items based on search query
	const filteredPublicItems = React.useMemo(() => {
		if (!searchQuery) return publicSection.items || []
		
		return publicSection.items?.filter(item => 
			item.title.toLowerCase().includes(searchQuery.toLowerCase())
		) || []
	}, [publicSection.items, searchQuery])

	// Filter remaining sections based on search query
	const filteredRemainingSections = React.useMemo(() => {
		if (!searchQuery) return remainingSections
		
		return remainingSections.map(section => {
			// If the section has items, filter them
			if (section.items) {
				return {
					...section,
					items: section.items.filter(item => 
						item.title.toLowerCase().includes(searchQuery.toLowerCase())
					)
				}
			}
			// If the section itself matches the search query, include it
			if (section.title.toLowerCase().includes(searchQuery.toLowerCase())) {
				return section
			}
			// Otherwise return the section with empty items
			return {
				...section,
				items: []
			}
		}).filter(section => !section.items || section.items.length > 0)
	}, [remainingSections, searchQuery])

	// Type correct handleClick for NavMain
	const handleItemClickForTool = async (tool: Tool) => {
		// Convert Tool to SidebarItem if needed
		const sidebarItem: SidebarItem = {
			title: tool.title,
			url: tool.url || tool.href,
			icon: tool.icon as unknown as React.ComponentType<{ className?: string }>,
			active: tool.isActive,
			search: tool.title // Use title as search if no specific search property
		}
		return handleItemClick(sidebarItem)
	}

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarContent>
				{/* Search input */}
				<SidebarSearch 
					searchQuery={searchQuery} 
					setSearchQuery={setSearchQuery} 
				/>

				{/* Public section */}
				{filteredPublicItems.length > 0 && (
					<PublicSection 
						section={publicSection} 
						items={filteredPublicItems} 
						handleClick={handleItemClick} 
					/>
				)}
				
				{/* Other sections (chatbot and beyond) */}
				<NavMain 
					title="Operaciones Transvip"
					items={filteredRemainingSections as unknown as Tool[]} 
					handleClick={handleItemClickForTool} 
					showHints={showHints} 
					showSearch={false}
				/>
			</SidebarContent>
			<SidebarFooter>
				<NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
				<NavUser user={session?.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}


