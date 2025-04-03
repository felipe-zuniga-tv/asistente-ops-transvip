"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { BotMessageSquare } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarRail,
	useSidebar,
	SidebarMenuSkeleton,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Routes } from "@/utils/routes"
import { sidebarData, chatbotMenu, publicSidebar } from "@/lib/core/config/chat-sidebar"
import { SidebarSearch } from "./sidebar-search"
import { PublicSection } from "./public-section"
import { useSidebarActions } from "@/components/chat/panel/use-sidebar-actions"
import { SidebarItem, Tool } from "@/components/chat/panel/types"
import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { getUserSectionAccess } from "@/lib/services/access-control"
import AppSidebarSkeleton from "./app-sidebar-skeleton"

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
	const { state } = useSidebar()
	const isCollapsed = state === "collapsed"

	// Replace useState and useEffect with useQuery
	const { data: allowedSections = [], isLoading } = useQuery<string[]>({
		queryKey: ['userSections', session?.user?.email],
		queryFn: async () => {
			if (!session?.user?.email) return []
			return getUserSectionAccess(session.user.email)
		},
		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
		gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
		enabled: !!session?.user?.email
	})

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

	// Filter sections based on user's access
	const remainingSections = React.useMemo(() => {
		const sections = isChatRoute
			? [chatbotMenu, ...sidebarData.navMain.filter(
				item => item.title !== publicSidebar.title && item.title !== chatbotMenu.title
			)]
			: [chatbotElement, ...sidebarData.navMain.filter(
				item => item.title !== publicSidebar.title && item.title !== chatbotMenu.title
			)]

		// Filter out sections that the user doesn't have access to
		return sections.filter(section => {
			// Chatbot is always accessible
			if (section.title === chatbotMenu.title) return true
			
			// Check if user has access to this section
			const sectionId = section.title.toLowerCase().replace(/\s+/g, '')
			return allowedSections.includes(sectionId)
		})
	}, [isChatRoute, chatbotElement, allowedSections, chatbotMenu.title])

	// Filter items based on search query and access control
	const filteredPublicItems = React.useMemo(() => {
		// First check if user has access to public section
		const publicSectionId = publicSidebar.title.toLowerCase().replace(/\s+/g, '')
		if (!allowedSections.includes(publicSectionId)) return []
		
		// Then apply search filter if needed
		if (!searchQuery) return publicSidebar.items || []
		
		return publicSidebar.items?.filter(item => 
			item.title.toLowerCase().includes(searchQuery.toLowerCase())
		) || []
	}, [publicSidebar.items, searchQuery, allowedSections])

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

	// Filter secondary navigation based on permissions
	const filteredSecondaryItems = React.useMemo(() => {
		return sidebarData.navSecondary.filter(item => {
			// External items (like Feedback) are always shown
			if (item.external) return true
			
			// For internal items (like Configuration), check permissions
			const sectionId = item.title.toLowerCase().replace(/\s+/g, '')
			return allowedSections.includes(sectionId)
		})
	}, [allowedSections])

	// Type correct handleClick for NavMain
	const handleItemClickForTool = async (tool: SidebarItem) => {
		// Convert Tool to SidebarItem if needed
		const sidebarItem: SidebarItem = {
			title: tool.title,
			url: tool.url || tool.url,
			icon: tool.icon as unknown as React.ComponentType<{ className?: string }>,
			active: tool.active,
			search: tool.search // Use title as search if no specific search property
		}
		return handleItemClick(sidebarItem)
	}

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarContent>
				{/* Conditionally render TransvipLogo or SidebarSearch based on sidebar state */}
				{isCollapsed ? (
					<div className="flex justify-center items-center p-2 mt-2">
						<TransvipLogo size={28} />
					</div>
				) : (
					<SidebarSearch 
						searchQuery={searchQuery} 
						setSearchQuery={setSearchQuery} 
					/>
				)}

				{isLoading ? (
					<AppSidebarSkeleton />
				) : (
					<>
						{/* Public section */}
						{filteredPublicItems.length > 0 && (
							<PublicSection 
								section={publicSidebar} 
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
						/>
					</>
				)}
			</SidebarContent>
			<SidebarFooter>
				<NavSecondary items={filteredSecondaryItems} className="mt-auto" />
				<NavUser user={session?.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}