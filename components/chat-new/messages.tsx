'use client';

import { ChatRequestOptions, Message } from 'ai';
import { memo, useRef, useEffect } from 'react';
import { PreviewMessage } from './message';
import { EmptyScreen } from './empty-screen';
import equal from 'fast-deep-equal';

interface MessagesProps {
  chatId: string;
  isLoading: boolean;
  messages: Array<Message>;
  setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) => void;
  reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
  isReadonly: boolean;
  session: any;
}

function useScrollToBottom() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return [containerRef, bottomRef, scrollToBottom] as const;
}

function PureMessages({
  chatId,
  isLoading,
  messages,
  setMessages,
  reload,
  isReadonly,
  session,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef, scrollToBottom] = useScrollToBottom();

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 px-4"
    >
      {messages.length === 0 && <EmptyScreen session={session} />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          index={index}
          chatId={chatId}
          message={message}
          isLoading={isLoading && messages.length - 1 === index}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          session={session}
        />
      ))}

      {isLoading && 
        messages.length > 0 && 
        messages[messages.length - 1].role === 'user' && (
          <div className="flex items-center gap-2 text-slate-500">
            <div className="animate-pulse">Pensando...</div>
          </div>
      )}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  return true;
}); 