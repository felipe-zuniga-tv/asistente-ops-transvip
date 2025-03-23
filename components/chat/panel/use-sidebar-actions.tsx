"use client"

import * as React from "react"
import { useActions, useUIState } from "ai/rsc"
import { useRouter } from "next/navigation"
import { SidebarItem } from "./types"
import { UserMessage } from "../message"
import { Routes } from "@/utils/routes"
import { nanoid } from "@/lib/utils"
import { chatbotMenu } from "@/lib/core/config/chat-sidebar"

export interface SidebarActions {
	handleItemClick: (item: SidebarItem) => Promise<void>
}

export function useSidebarActions(): SidebarActions {
	const [_, setMessages] = useUIState()
	const { submitUserMessage } = useActions()
	const router = useRouter()

	const handleItemClick = async (item: SidebarItem) => {
		if (item.title === chatbotMenu.title) {
			router.push(Routes.CHAT)
			return
		}

		const userMessageContent = `${item.search || ""}`.trim()
		
		setMessages((currentMessages: any[]) => [
			...currentMessages,
			{
				id: nanoid(),
				display: <UserMessage content={userMessageContent} session={null} />
			}
		])

		const response = await submitUserMessage(userMessageContent)
		setMessages((currentMessages: any[]) => [
			...currentMessages,
			response
		])
	}

	return { handleItemClick }
} 