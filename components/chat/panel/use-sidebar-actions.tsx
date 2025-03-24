"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SidebarItem } from "./types"
import { Routes } from "@/utils/routes"
import { chatbotMenu } from "@/lib/core/config/chat-sidebar"
import { useMessageSubmission } from "@/hooks/use-message-submission"

export interface SidebarActions {
	handleItemClick: (item: SidebarItem) => Promise<void>
}

export function useSidebarActions(): SidebarActions {
	const { submitMessage } = useMessageSubmission()
	const router = useRouter()

	const handleItemClick = async (item: SidebarItem) => {
		if (item.title === chatbotMenu.title) {
			router.push(Routes.CHAT)
			return
		}

		const userMessageContent = `${item.search || ""}`.trim()
		await submitMessage(userMessageContent)
	}

	return { handleItemClick }
} 