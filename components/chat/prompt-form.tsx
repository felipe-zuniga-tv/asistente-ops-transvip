'use client'

import { useEffect, useRef } from 'react'
import Textarea from 'react-textarea-autosize'

import { useActions, useUIState } from 'ai/rsc'

import { UserMessage } from './message'
import { Message, type AI } from '@/lib/services/chat/actions'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { ArrowRight, PlusCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const SHOW_FILE_BUTTON = false

export function PromptForm({ session, input, setInput } : { 
    session: any,
    input: string
    setInput: (value: string) => void
}) {
    const { formRef, onKeyDown } = useEnterSubmit()
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const { submitUserMessage } = useActions()
    const [_, setMessages] = useUIState<typeof AI>()

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    const fileRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (event: any) => {
        // if (!event.target.files) {
        //     toast.error('No file selected')
        //     return
        // }

        // const file = event.target.files[0]

        // if (file.type.startsWith('video/')) {
        //     const responseMessage = await describeImage('')
        //     setMessages((currentMessages: Message[]) => [
        //         ...currentMessages,
        //         responseMessage
        //     ])
        // } else {
        //     const reader = new FileReader()
        //     reader.readAsDataURL(file)

        //     reader.onloadend = async () => {
        //         const base64String = reader.result
        //         const responseMessage = await describeImage(base64String)
        //         setMessages((currentMessages: Message[]) => [
        //             ...currentMessages,
        //             responseMessage
        //         ])
        //     }
        // }
    }

    const handleFormSubmit = async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
            e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        // Optimistically add user message UI
        setMessages((currentMessages: any) => [
            ...currentMessages,
            {
                id: nanoid(),
                display: <UserMessage session={session} content={value} />
            }
        ])

        // Submit and get response message
        const responseMessage = await submitUserMessage(value)
        setMessages((currentMessages: any) => [...currentMessages, responseMessage])
    }

    return (
        <form ref={formRef} onSubmit={handleFormSubmit} className='bg-white'>
            <input id="file" type="file"
                className="hidden"
                ref={fileRef}
                onChange={e => handleFileChange(e)}
            />
            <div className={cn(
                "relative flex flex-col grow w-full max-h-60 overflow-hidden",
                `${SHOW_FILE_BUTTON ? 'pl-4': 'pl-4 md:pl-8'}`
            )}>
                <Button variant="outline" size="icon"
                    className={cn(`${SHOW_FILE_BUTTON ? '': 'hidden'}`,
                        'absolute size-8 left-4 top-[1.0rem] bg-transparent shadow-none text-slate-700 rounded-full hover:bg-gray-400 hover:text-white bg-gray-200'
                    )}
                    onClick={() => {
                        fileRef.current?.click()
                    }}
                >
                    <PlusCircleIcon />
                    <span className="sr-only">Nuevo Chat</span>
                </Button>
                {/* 
                <Tooltip>
                    <TooltipTrigger asChild>
                    </TooltipTrigger>
                    <TooltipContent>Sube un archivo</TooltipContent>
                </Tooltip> 
                */}
                <Textarea ref={inputRef}
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                    placeholder="Pregúntame lo que necesites..."
                    className="text-slate-900 min-h-[60px] max-h-[150px] overflow-auto w-full bg-transparent placeholder:text-slate-500 resize-none py-[1.3rem] pr-32 focus-within:outline-none text-sm md:text-base"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    name="message"
                    rows={1}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <div className="absolute right-4 top-[13px] sm:right-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="submit"
                                size="default"
                                disabled={input === ''}
                                className="bg-transparent shadow-none text-white rounded-full hover:bg-slate-500 bg-slate-800"
                                aria-label="Enviar"
                            >
                                <span className="hidden sm:block mr-2">Enviar</span>
                                <ArrowRight />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Enviar</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </form>
    )
}