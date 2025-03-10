'use client';

import type { Message } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { generateUUID } from '@/lib/utils';
import { ChatHeader } from '@/components/chat-new/chat-header';
import { Messages } from '@/components/chat-new/messages';
import { MultimodalInput } from '@/components/chat-new/multimodal-input';
import { toast } from 'sonner';

export interface ChatProps {
  id: string;
  initialMessages: Array<Message>;
  isReadonly?: boolean;
  session: any;
}

export function Chat({
  id,
  initialMessages,
  isReadonly = false,
  session,
}: ChatProps) {
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: { id },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      // If we needed to update history, we would do it here
    },
    onError: () => {
      toast.error('Ocurrió un error, por favor intenta de nuevo!');
    },
  });

  const [attachments, setAttachments] = useState<any[]>([]);

  return (
    <div className="flex flex-col min-w-0 h-full bg-background rounded-md">
      <ChatHeader
        chatId={id}
        isReadonly={isReadonly}
        session={session}
      />

      <Messages
        chatId={id}
        isLoading={isLoading}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        isReadonly={isReadonly}
        session={session}
      />

      <form className="flex mx-auto px-4 bg-background pb-4 gap-2 w-full">
        {!isReadonly && (
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            setMessages={setMessages}
            append={append}
            session={session}
          />
        )}
      </form>
    </div>
  );
} 