'use client'

// import { useLocalStorage } from '@/hooks/use-local-storage'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/utils/ui'
import { useAIState, useUIState } from 'ai/rsc'
import { useScrollAnchor } from '@/hooks/use-scroll-anchor'
import { MessagesList } from './messages-list'
import { EmptyScreen } from './empty-screen'
import { ChatPanel } from './chat-panel'
import type { ChatProps } from '@/types/domain/chat/models'
import { NewChatButton } from './new-chat-button'
import { Routes } from '@/utils/routes'

export function Chat({ id, initialMessages, className, session }: ChatProps) {
	const router = useRouter()
	const path = usePathname()
	const [input, setInput] = useState('')
	const [messages, setMessages] = useUIState()
	const [aiState] = useAIState()

	// const [_, setNewChatId] = useLocalStorage('newChatId', id)

	// useEffect(() => {
	//     if (session?.user) {
	//         if (path.includes('chat') && messages.length === 0) {
	//             window.history.replaceState({}, '', `/chat/${id}`)
	//             console.log("redirigir")
	//         }
	//     }
	// }, [id, path, session?.user, messages])

	useEffect(() => {
		const messagesLength = aiState.messages?.length
		if (messagesLength === 2) {
			router.refresh()
		}
	}, [aiState.messages, router])

	// useEffect(() => {
	//     setNewChatId(id)
	// }, [id, setNewChatId])

	const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } = useScrollAnchor()

	const handleNewChat = () => {
		setMessages([]);
		router.push(Routes.CHAT);
		router.refresh();
	}

	return (
		<div className="flex flex-col size-full mx-auto justify-between">
			<div className="flex sticky top-0 pb-3 items-center px-0 gap-2 bg-transparent z-10">
				<NewChatButton onClick={handleNewChat} />
			</div>

			<div ref={scrollRef} className="flex-1 overflow-auto">
				<div className="h-full flex flex-col justify-between">
					<div className={cn('flex-1 overflow-auto max-h-[76vh] pb-12', className as string)} ref={messagesRef}>
						{messages.length ?
							(<MessagesList messages={messages} isShared={false} session={session} />) :
							(<EmptyScreen session={session} />)
						}
						<div className="h-px w-full" ref={visibilityRef} />
					</div>
					<ChatPanel id={id}
						input={input}
						session={session}
						setInput={setInput}
						isAtBottom={isAtBottom}
						scrollToBottom={scrollToBottom}
					/>
				</div>
			</div>
		</div>
	)
}