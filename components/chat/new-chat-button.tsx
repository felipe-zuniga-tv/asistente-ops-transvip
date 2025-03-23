'use client'

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface NewChatButtonProps {
	onClick: () => void
}

export function NewChatButton({ onClick }: NewChatButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="ml-auto h-8"
					onClick={onClick}
				>
					<PlusIcon size={16} />
					<span className="text-xs">Nuevo Chat</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent>Nuevo Chat</TooltipContent>
		</Tooltip>
	)
} 