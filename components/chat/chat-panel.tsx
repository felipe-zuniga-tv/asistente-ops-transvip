import { PromptForm } from './prompt-form'
// import { ButtonScrollToBottom } from '../button-scroll-to-bottom'

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
    return (
        <>
            {/* <ButtonScrollToBottom isAtBottom={isAtBottom} scrollToBottom={scrollToBottom} /> */}
            <div className="relative inset-x-0 bottom-0 overflow-hidden rounded-lg border border-slate-500 md:border-slate-400 bg-transparent z-20">
                <PromptForm session={session} input={input} setInput={setInput} />
            </div>
        </>
    )
}