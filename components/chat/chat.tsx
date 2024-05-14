'use client'

import { Message } from '@/lib/chat/actions'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { cn } from '@/lib/utils'
import { useAIState, useUIState } from 'ai/rsc'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MessagesList } from './messages-list'
import { EmptyScreen } from './empty-screen'
import { ChatPanel } from './chat-panel'
// import { toast } from 'sonner'

export interface ChatProps extends React.ComponentProps<'div'> {
    initialMessages?: Message[]
    id?: string
    session?: any // Session
    //   missingKeys: string[]
}

export function TransvipOpsChat({ id, className, session }: ChatProps) {
    const router = useRouter()
    const path = usePathname()
    const [input, setInput] = useState('')
    const [messages] = useUIState()
    const [aiState] = useAIState()

    const [_, setNewChatId] = useLocalStorage('newChatId', id)

    useEffect(() => {
        if (session?.user) {
            if (!path.includes('chat') && messages.length === 1) {
                window.history.replaceState({}, '', `/chat/${id}`)
            }
        }
    }, [id, path, session?.user, messages])

    useEffect(() => {
        const messagesLength = aiState.messages?.length
        if (messagesLength === 2) {
            router.refresh()
        }
    }, [aiState.messages, router])

    useEffect(() => {
        setNewChatId(id)
    })

    const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } = useScrollAnchor()

    return (
        <div ref={scrollRef} className="flex flex-col size-full overflow-auto justify-between">
            <div className={cn('flex-1 pb-[160px] overflow-auto max-h-[76vh]', className)} ref={messagesRef}>
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