'use client'
import { StreamableValue } from "ai/rsc"
import { MemoizedReactMarkdown } from "@/components/ui/markdown"
import { useStreamableText } from "@/hooks/use-streamable-text"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { cn } from '@/utils/ui'
import { TransvipLogo } from "@/components/features/transvip/transvip-logo"
import { ChatSession } from "@/types/domain/chat"

export function BotCard({ children, className = "" }: { children: React.ReactNode, className: string }) {
	return (
		<div className={cn('chat-message assistant group relative flex items-start', className)}>
			<div className="flex flex-col gap-3 w-full">
				{children}
				<div className="flex flex-row gap-2 justify-end items-center text-xs">
					<TransvipLogo logoOnly={true} colored={false} size={20} />
				</div>
			</div>
		</div>
	)
}

export function UserMessage({ session, content }: { session?: ChatSession, content: string }) {
	return (
		<div className="chat-message user flex items-start">
			<div className="flex flex-col gap-1 w-full">
				{ content }
				<div className="flex flex-row gap-0 justify-end items-center text-xs">
					{ session && <span>{ session.user.full_name }</span>}
				</div>
			</div>
		</div>
	)
}

export function AssistantMessage({ content, className, showAvatar = true }: {
	content: string | StreamableValue<string>
	className?: string
	showAvatar?: boolean
}) {
	return (
		<div className={cn('chat-message assistant flex items-start', className as string)}>
			<div className="flex flex-col gap-1 w-full">
				<AssistantMessageContent content={content} />
				
				{ showAvatar && (
					<div className="flex flex-row gap-2 justify-end items-center text-xs">
						<TransvipLogo logoOnly={true} colored={false} size={20} />
					</div>
				)}
			</div>
		</div>
	)
}

export function AssistantMessageContent({ content }: {
	content: string | StreamableValue<string> 
}) {
	const text = useStreamableText(content)

	return (
		<MemoizedReactMarkdown className=""
			remarkPlugins={[remarkGfm, remarkMath]}
			components={{
				p({ children }) {
					return <p className="first-of-type:mt-0 only:my-0">{children}</p>
				},
				ul({ children }) {
					return <ul className="list-none flex flex-col gap-2">{children}</ul>
				},
				ol({ children }) {
					return <ol className="list-none flex flex-col gap-2">{children}</ol>
				},
				li({ children }) {
					return <li className="p-3 bg-slate-900 text-white rounded-md shadow-md">{children}</li>
				},
				a({ children, ...props }) {
					return <a {...props} target="_blank" className="font-bold underline">{children}</a>
				},
			}}
		>
			{text}
		</MemoizedReactMarkdown>
	)
}

export function LoadingMessage({ text = 'Espera...', className } :{
	text: string
	className?: string
}) {
	return (
		<div className={cn(`loading-message bg-slate-700 text-white rounded-md shadow-md flex flex-col gap-3 whitespace-pre-wrap mb-2 animate-pulse justify-center items-center bg-gradient-to-r from-gray-100 via-white to-slate-100 p-3`, className as string)}>
			<div className="flex flex-row gap-3 justify-center items-center text-gray-700">
				<TransvipLogo size={20} className="assistant-logo rounded-md" />
				<span>{ text }</span>
			</div>
		</div>
	)
}