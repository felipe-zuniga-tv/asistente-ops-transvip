// Types for chat panel components
import { LucideIcon } from "lucide-react"

export interface SidebarItem {
	title: string
	url?: string
	icon?: LucideIcon | undefined
	active?: boolean
	search?: string
	external?: boolean
	items?: Tool[]
	highlight?: boolean
}

// Tools - Consolidated Interface
export interface Tool {
    title: string;
    url?: string;         // Primary link property
    icon?: LucideIcon;
    active?: boolean;     // Standardized active state property
    highlight?: boolean;  // For UI highlighting
    hint?: string;        // Hint text
    items?: Tool[];       // For potential nesting
    search?: string;      // Search related property
}

export interface SidebarSection {
	title: string
	items?: SidebarItem[]
	highlight?: boolean
}

// Ensure compatibility with Tool type that seems to be expected by NavMain 