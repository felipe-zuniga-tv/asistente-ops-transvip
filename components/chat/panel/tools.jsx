'use client'
import { useActions, useUIState } from "ai/rsc"
import { UserMessage } from "../message"
import { nanoid } from "nanoid"
import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { toolsList } from "@/lib/chat/config"

export default function SystemTools({ session }) {
    const [_, setMessages] = useUIState()
    const { submitUserMessage } = useActions()

	const handleClick = async ({ tool }) => {
        const userMessageContent = `${tool.search}`.trim()

        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: nanoid(),
                display: <UserMessage content={userMessageContent} session={session} />
            }
        ])

        const response = await submitUserMessage(userMessageContent)
        setMessages((currentMessages) => [
            ...currentMessages,
            response
        ])
    }

    return (
        <div className="tools flex flex-col gap-3 items-start justify-center">
            <span className="font-semibold">Selecciona una herramienta</span>
            <div className="max-h-[570px] overflow-auto w-full">
                <div className="flex flex-col gap-2.5 items-start justify-center w-full">
                    {
                        toolsList.map((tool, index) => (
                            <div key={index + 1} 
                                className="border p-2 bg-white hover:bg-gray-200/50 hover:cursor-pointer rounded-md shadow-md w-full flex items-center justify-start gap-3 text-muted-background"
                                onClick={() => handleClick({ tool })}
                            >
                                <tool.icon className="size-5 text-transvip" />
                                <div className="grid gap-0.5">
                                    <span>{ tool.name }</span>
                                    <p className="text-xs text-muted-foreground" data-description>{ tool.hint }</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}