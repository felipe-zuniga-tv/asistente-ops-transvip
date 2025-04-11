'use client';

import type { Attachment, ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo, useRef, useEffect, useState, type Dispatch, type SetStateAction, type ChangeEvent } from 'react';
import { toast } from 'sonner';
import { SendIcon, PaperclipIcon, StopCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/ui';
import equal from 'fast-deep-equal';

interface MultimodalInputProps {
	chatId: string;
	input: string;
	setInput: (value: string) => void;
	isLoading: boolean;
	stop: () => void;
	attachments: Array<Attachment>;
	setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
	messages: Array<Message>;
	setMessages: Dispatch<SetStateAction<Array<Message>>>;
	append: (
		message: Message | CreateMessage,
		chatRequestOptions?: ChatRequestOptions,
	) => Promise<string | null | undefined>;
	handleSubmit: (
		event?: { preventDefault?: () => void },
		chatRequestOptions?: ChatRequestOptions,
	) => void;
	className?: string;
	session: any;
}

function PureMultimodalInput({
	chatId,
	input,
	setInput,
	isLoading,
	stop,
	attachments,
	setAttachments,
	messages,
	setMessages,
	append,
	handleSubmit,
	className,
}: MultimodalInputProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (textareaRef.current) {
			adjustHeight();
		}
	}, []);

	const adjustHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
		}
	};

	const resetHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = '56px';
		}
	};

	const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(event.target.value);
		adjustHeight();
	};

	const submitForm = () => {
		handleSubmit(undefined, {
			// If we had attachments, we'd include them here
			// experimental_attachments: attachments,
		});

		setAttachments([]);
		setInput('');
		resetHeight();

		// Focus back on the textarea after submitting
		setTimeout(() => {
			if (textareaRef.current) {
				textareaRef.current.focus();
			}
		}, 100);
	};

	return (
		<div className="relative w-full flex flex-col gap-4">
			<div className="flex flex-col w-full gap-2">
				<Textarea
					ref={textareaRef}
					placeholder="Envía un mensaje..."
					value={input}
					onChange={handleInput}
					className={cn(
						"min-h-[56px] max-h-[200px] overflow-y-auto resize-none rounded-lg p-3 pr-16 text-base bg-muted",
						className
					)}
					onKeyDown={(event) => {
						if (
							event.key === "Enter" &&
							!event.shiftKey &&
							!event.nativeEvent.isComposing
						) {
							event.preventDefault();

							if (isLoading) {
								toast.error('Por favor espera a que termine la respuesta actual');
							} else if (input.trim()) {
								submitForm();
							}
						}
					}}
				/>

				<div className="absolute right-3 bottom-3">
					{isLoading ? (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								stop();
							}}
							className="h-8 w-8 rounded-full bg-background"
						>
							<StopCircleIcon className="h-4 w-4" />
							<span className="sr-only">Detener generación</span>
						</Button>
					) : (
						<Button
							variant="ghost"
							size="icon"
							disabled={input.trim().length === 0}
							onClick={() => {
								if (input.trim()) {
									submitForm();
								}
							}}
							className="h-8 w-8 rounded-full bg-background"
						>
							<SendIcon className="h-4 w-4" />
							<span className="sr-only">Enviar mensaje</span>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

export const MultimodalInput = memo(PureMultimodalInput, (prevProps, nextProps) => {
	if (prevProps.input !== nextProps.input) return false;
	if (prevProps.isLoading !== nextProps.isLoading) return false;
	if (!equal(prevProps.attachments, nextProps.attachments)) return false;
	return true;
}); 