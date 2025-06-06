import { UIState } from "@/types/domain/chat/types"
import { nanoid } from 'nanoid'

export interface ChatList {
    messages: UIState
    session?: any // Session
    isShared: boolean
}

export function MessagesList({ messages, session, isShared }: ChatList) {
    return messages.length ? (
        <div className="messages-list">
            {
                messages.map(message => (
                    <div className='message-item' key={message.id + nanoid()}>
                        {message.display}
                    </div>
                ))
            }
        </div>
    ) : null
}