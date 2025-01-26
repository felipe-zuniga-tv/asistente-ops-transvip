'use client'

import { Message } from '@/lib/chat/actions'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useScrollAnchor } from '@/hooks/use-scroll-anchor'
import { cn } from '@/lib/utils'
import { useAIState, useUIState } from 'ai/rsc'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MessagesList } from './messages-list'
import { EmptyScreen } from './empty-screen'
import { ChatPanel } from './chat-panel'
import type { ChatProps } from '@/lib/types'

export function Chat({ id, initialMessages, className, session }: ChatProps) {
    const router = useRouter()
    const path = usePathname()
    const [input, setInput] = useState('')
    const [messages] = useUIState()
    const [aiState] = useAIState()

    const [_, setNewChatId] = useLocalStorage('newChatId', id)

    // useEffect(() => {
    //     if (session?.user) {
    //         if (!path.includes('chat') && messages.length === 1) {
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

    useEffect(() => {
        setNewChatId(id)
    }, [id])

    const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } = useScrollAnchor()

    return (
        <div ref={scrollRef} className="flex flex-col size-full mx-auto overflow-auto justify-between">
            <div className={cn('flex-1 pb-[120px] overflow-auto max-h-[76vh]', className as string)} ref={messagesRef}>
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
    )
}