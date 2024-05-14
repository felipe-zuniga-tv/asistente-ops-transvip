// import { useAIState, useActions, useUIState } from 'ai/rsc'
// import type { AI, Message } from '@/lib/chat/actions'
// import { nanoid } from 'nanoid'
// import { UserMessage } from './message'
// import { cn } from '@/lib/utils'
// import { toast } from 'sonner'
// import { startingMessages } from '@/lib/chat/config'
import { PromptForm } from './prompt-form'
import { ButtonScrollToBottom } from '../button-scroll-to-bottom'

export interface ChatPanelProps {
    id?: string
    title?: string
    input: string
    session: any
    setInput: (value: string) => void
    isAtBottom: boolean
    scrollToBottom: () => void
}

export function ChatPanel({
    id,
    title,
    session,
    input,
    setInput,
    isAtBottom,
    scrollToBottom
}: ChatPanelProps) {
    // const [aiState] = useAIState()
    // const [messages, setMessages] = useUIState<typeof AI>()
    // const { submitUserMessage } = useActions()
    
    return (
        <>
            <ButtonScrollToBottom isAtBottom={isAtBottom} scrollToBottom={scrollToBottom} />
            <div className="relative inset-x-0 bottom-0 overflow-hidden rounded-lg border bg-transparent z-20">
                <PromptForm session={session} input={input} setInput={setInput} />
            </div>
        </>
    )
}