import { LucideIcon, BotMessageSquare } from "lucide-react";
import { SidebarItem, SidebarSection, Tool } from "@/components/chat/panel/types";
import { Routes } from "@/utils/routes";

// --- Helper Functions ---
export function generateSectionId(title: string): string {
	return title.toLowerCase().replace(/\s+/g, '')
}

// Add specific interface for chatbot menu config
export interface ChatbotConfig extends SidebarSection {
	icon?: React.ComponentType<{ className?: string }> | LucideIcon; // Add optional icon
}

export function filterItemsBySearch<T extends { title: string }>(items: T[], query: string): T[] {
	if (!query) return items
	const lowerCaseQuery = query.toLowerCase()
	return items.filter(item => item.title.toLowerCase().includes(lowerCaseQuery))
}

export function filterPublicItems(
	publicConfig: SidebarSection,
	query: string,
	allowedSections: string[]
): SidebarItem[] {
	// TODO: Use predefined ID from publicConfig.id when available
	const publicSectionId = generateSectionId(publicConfig.title) 
	if (!allowedSections.includes(publicSectionId)) return []
	
	const items = publicConfig.items || []
	return filterItemsBySearch(items, query)
}

export function filterRemainingSections(
	mainNavSections: SidebarSection[], 
	isChatRoute: boolean,
	query: string,
	allowedSections: string[],
	chatbotConfig: ChatbotConfig, 
	publicConfig: SidebarSection
): Tool[] { 
	const chatbotElement: Tool = { 
		title: chatbotConfig.title,
		url: "#", 
		icon: chatbotConfig.icon ? chatbotConfig.icon as LucideIcon : undefined, 
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

	// TODO: Use predefined IDs (e.g., item.id) when available in config
	const baseSections = mainNavSections.filter(
		item => item.title !== publicConfig.title && item.title !== chatbotConfig.title
	)

	const sectionsSource = isChatRoute
		? [chatbotConfig, ...baseSections]
		// Cast needed if mixing types, potentially avoidable with better type union/guard
		: [chatbotElement as unknown as SidebarSection, ...baseSections] 

	// Filter sections by access
	const accessibleSections = sectionsSource.filter(section => {
		if (section.title === chatbotConfig.title) return true
		// TODO: Use predefined ID (e.g., section.id) when available
		const sectionId = generateSectionId(section.title) 
		return allowedSections.includes(sectionId)
	})

	// If no search query, map all accessible sections to Tool format and return
	if (!query) {
		// Map accessibleSections to Tool[] structure
		// TODO: Review if this mapping is correct based on Tool definition
		return accessibleSections.map(section => ({
			...section, // Spread properties from SidebarSection
			title: section.title,
			// Cast items - ensure SidebarItem is compatible with Tool's item structure
			items: (section.items || []) as unknown as Tool[], 
			// Provide default/derived Tool properties
			url: "#", // Placeholder - Determine correct href for a section Tool
			active: false // Placeholder - Determine correct isActive
		})) as unknown as Tool[]; // Final cast might still be needed
	}

	// If there IS a search query, filter sections and their items
	const lowerCaseQuery = query.toLowerCase()
	const resultSections: Tool[] = []; // Accumulate results matching Tool[]

	accessibleSections.forEach(section => {
		const titleMatch = section.title.toLowerCase().includes(lowerCaseQuery);
		// Always filter items based on the query if items exist
		const filteredItems = section.items ? filterItemsBySearch(section.items, query) : [];
		const hasMatchingItems = filteredItems.length > 0;

		// Include the section if its title matches OR it has items that match the query
		if (titleMatch || hasMatchingItems) {
			// Map the section and its *filtered* items to the Tool structure
			resultSections.push({
				...section, // Spread original section properties first
				title: section.title, // Ensure title is present
				// Use the filtered items, casting if necessary
				items: filteredItems as unknown as Tool[], 
				// Provide default/derived Tool properties (adjust as needed)
				url: "#", // Placeholder - Determine correct href for a section Tool
				active: false // Placeholder - Determine correct isActive
			});
		}
	});

	return resultSections; // Return the filtered and mapped sections
}


export function filterSecondaryItems(
	secondaryNavItems: SidebarItem[], 
	allowedSections: string[]
): SidebarItem[] {
	return secondaryNavItems.filter(item => {
		if (item.external) return true // Keep external links
		// TODO: Use predefined ID (e.g., item.id) when available
		const sectionId = generateSectionId(item.title) 
		return allowedSections.includes(sectionId)
	})
} 