'use client';

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Message, ChatRequestOptions } from 'ai';
import { memo } from 'react';
import { TransvipLogo } from '@/components/features/transvip/transvip-logo';
import { MemoizedReactMarkdown } from '@/components/ui/markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { cn } from '@/utils/ui';

export interface MessageProps {
  index: number;
  message: Message;
  isLoading: boolean;
  chatId: string;
  setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) => void;
  reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
  isReadonly: boolean;
  session: any;
}

function PurePreviewMessage({
  message,
  isLoading,
  session,
}: MessageProps) {
  const formattedTimestamp = message.createdAt
    ? formatDistanceToNow(new Date(message.createdAt), {
        addSuffix: true,
        locale: es, 
      })
    : '';

  return (
    <div className={cn(
      'message group relative md:w-[85%] lg:w-[80%]',
      message.role === 'user' ? 'ml-auto' : 'mr-auto'
    )}>
      <div className={cn(
        'flex flex-col gap-2 rounded-lg p-4',
        message.role === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      )}>
        {message.role === 'user' ? (
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        ) : (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <MemoizedReactMarkdown
              className="prose prose-slate dark:prose-invert break-words prose-p:leading-relaxed prose-pre:p-0"
              remarkPlugins={[remarkGfm, remarkMath]}
              components={{
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc pl-6 mb-2">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-6 mb-2">{children}</ol>;
                },
                li({ children }) {
                  return <li className="mb-1">{children}</li>;
                },
                a({ children, ...props }) {
                  return (
                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                      {children}
                    </a>
                  );
                },
              }}
            >
              {message.content}
            </MemoizedReactMarkdown>
          </div>
        )}
        
        <div className="flex items-center justify-end gap-2 text-xs text-white mt-1">
          {message.role === 'user' ? (
            <span>{session?.user?.fullName || 'Usuario'}</span>
          ) : (
            <div className="flex items-center gap-1">
              <TransvipLogo logoOnly colored={false} size={16} />
              <span>Asistente</span>
            </div>
          )}
          <span>·</span>
          {message.createdAt && <span className="">{formattedTimestamp}</span>}
        </div>
      </div>
    </div>
  );
}

export const PreviewMessage = memo(PurePreviewMessage); 