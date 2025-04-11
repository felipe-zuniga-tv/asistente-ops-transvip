'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TransvipLogo } from '@/components/features/transvip/transvip-logo';

function PureChatHeader({
	chatId,
	isReadonly,
	session,
}: {
	chatId: string;
	isReadonly: boolean;
	session: any;
}) {
	const router = useRouter();

	return (
		<div className="flex sticky top-0 py-1.5 items-center px-2 md:px-2 gap-2">
			<div className="flex items-center">
				<TransvipLogo colored size={24} className="mr-2" />
				<span className="hidden">{ chatId }</span>
			</div>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto"
						onClick={() => {
							router.push('/chat-new');
							router.refresh();
						}}
					>
						<PlusIcon size={16} />
						<span className="md:sr-only">Nuevo Chat</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>Nuevo Chat</TooltipContent>
			</Tooltip>

			{false && session?.user && (
				<div className="hidden md:flex items-center text-sm ml-auto">
					<span>{session.user.full_name}</span>
				</div>
			)}
		</div>
	);
}

export const ChatHeader = memo(PureChatHeader); 