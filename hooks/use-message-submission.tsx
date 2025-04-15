'use client'

import * as React from 'react'
import { useActions, useUIState } from 'ai/rsc'
import { nanoid } from '@/utils/id'
import { UserMessage } from '@/components/features/chat/message'
import { ChatSession } from '@/types/domain/chat'

export function useMessageSubmission() {
  const [_, setMessages] = useUIState()
  const { submitUserMessage } = useActions()

  const submitMessage = async (content: string, session: ChatSession) => {
    setMessages((currentMessages: any[]) => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <UserMessage content={content} session={session} />
      }
    ])

    const response = await submitUserMessage(content)
    setMessages((currentMessages: any[]) => [
      ...currentMessages,
      response
    ])

    return response
  }

  return { submitMessage }
} 