// Types for chat panel components
import { LucideIcon } from "lucide-react"

export interface SidebarItem {
	title: string
	url?: string
	icon?: React.ComponentType<{ className?: string }>
	active?: boolean
	search?: string
}

export interface SidebarSection {
	title: string
	items?: SidebarItem[]
	highlight?: boolean
}

// Ensure compatibility with Tool type that seems to be expected by NavMain
export interface Tool {
	title: string
	url?: string
	href?: string
	icon?: LucideIcon
	isActive?: boolean
	highlight?: boolean
	items?: Tool[]
} 