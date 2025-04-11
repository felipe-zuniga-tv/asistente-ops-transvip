"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { NavMain } from "@/components/layouts/sidebar/nav-main"
import { NavUser } from "@/components/layouts/sidebar/nav-user"
import { NavSecondary } from "@/components/layouts/sidebar/nav-secondary"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar"
import { Routes } from "@/utils/routes"
import { sidebarData, chatbotMenu, publicSidebar } from "@/lib/core/config/chat-sidebar"
import { SidebarSearch } from "./sidebar-search"
import { PublicSection } from "./public-section"
import { useSidebarActions } from "@/components/features/chat/panel/use-sidebar-actions"
import { SidebarItem, Tool } from "@/components/features/chat/panel/types"
import { TransvipLogo } from "@/components/features/transvip/transvip-logo"
import { getUserSectionAccess } from "@/lib/services/access-control"
import AppSidebarSkeleton from "./app-sidebar-skeleton"

// Import helper functions
import {
	filterPublicItems,
	filterRemainingSections,
	filterSecondaryItems
} from "@/lib/sidebar/helpers"
import { LucideIcon } from "lucide-react"
import { ChatSession } from "@/lib/core/types/chat"

// --- Component Props Interface ---
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	session: ChatSession | null
}

// --- Main Sidebar Component ---
export function AppSidebar({ session, ...props }: AppSidebarProps) {
	const path = usePathname()
	const isChatRoute = path === Routes.CHAT
	const [searchQuery, setSearchQuery] = React.useState("")
	const { handleItemClick } = useSidebarActions()
	const { state } = useSidebar()
	const isCollapsed = state === "collapsed"

	const { data: allowedSections = [], isLoading } = useQuery<string[]>({
		queryKey: ['userSections', session?.user?.email],
		queryFn: async () => {
			// Ensure email exists before calling
			if (!session?.user?.email) return [] 
			return getUserSectionAccess(session.user.email)
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 30 * 60 * 1000,
		enabled: !!session?.user?.email, // Query enabled only if email exists
	})

	// Chatbot configuration (remains for now, might be part of sidebarData)
	const showHints = false

	// Use helper functions within useMemo
	const filteredPublicItems = React.useMemo(() => 
		filterPublicItems(publicSidebar, searchQuery, allowedSections),
		[searchQuery, allowedSections]
	)

	// Filter remaining sections based on search query and access
	const filteredRemainingSections = React.useMemo(() => 
		filterRemainingSections(
			sidebarData.navMain, 
			isChatRoute, 
			searchQuery, 
			allowedSections, 
			chatbotMenu, // Pass chatbotMenu (implicitly typed as ChatbotConfig now)
			publicSidebar
		),
		[isChatRoute, searchQuery, allowedSections] // Ensure dependencies are correct
	)

	// Filter secondary navigation based on permissions
	const filteredSecondaryItems = React.useMemo(() => 
		filterSecondaryItems(sidebarData.navSecondary, allowedSections),
		[allowedSections]
	)

	// Updated handleClick to accept Tool and map to SidebarItem
	const handleItemClickForTool = async (tool: Tool) => {
		// Map Tool properties to SidebarItem properties for handleItemClick
		const sidebarItem: SidebarItem = {
			title: tool.title,
			url: tool.url, // Use url or href from Tool
			icon: tool.icon, // Directly use tool.icon (now LucideIcon | undefined)
			active: tool.active, // Use isActive from Tool
			search: tool.search ?? tool.title // Use search or fallback to title
		}
		return handleItemClick(sidebarItem)
	}

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarContent>
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
						{filteredPublicItems.length > 0 && (
							<PublicSection 
								section={publicSidebar} 
								items={filteredPublicItems} 
								// Assuming PublicSection's handleClick expects SidebarItem
								handleClick={handleItemClick} 
							/>
						)}
						
						<NavMain 
							items={filteredRemainingSections} // Use directly, no cast needed if helper returns Tool[]
							handleClick={handleItemClickForTool} 
							showHints={showHints} 
						/>
					</>
				)}
			</SidebarContent>
			<SidebarFooter>
				<NavSecondary 
					// Filter items to ensure url and icon are defined as required by NavSecondary
					items={filteredSecondaryItems.filter(
						(item): item is SidebarItem & { url: string; icon: LucideIcon } => 
							typeof item.url === 'string' && typeof item.icon !== 'undefined'
					)}
					className="mt-auto" 
				/>
				{/* Conditionally render NavUser only when session.user exists */}
				{session?.user && (
					<NavUser user={session.user} /> 
				)}
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}