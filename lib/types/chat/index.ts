import type { Message } from '@/lib/chat/actions'

export interface ChatProps extends React.ComponentProps<'div'> {
    initialMessages?: Message[]
    id?: string
    session?: any // TODO: Add proper session type
}

export type { Message, AIState, UIState } from '@/lib/chat/actions' 