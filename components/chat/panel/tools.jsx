'use client'
import { useActions, useUIState } from "ai/rsc"
import { UserMessage } from "../message"
import { Car } from "lucide-react"
import { nanoid } from "nanoid"

const toolsList = [
    {
        name: 'Conexión de un móvil',
        hint: 'Utiliza el número de móvil para la búsqueda',
        search: 'Me gustaría saber si un vehículo específico se encuentra conectado'
    },
    {
        name: 'Detalle por reserva o paquete',
        hint: 'Busca una reserva o paquete usando su código',
        search: 'Me gustaría saber más información sobre una reserva o paquete'
    },
    {
        name: 'Detalle de un móvil',
        hint: 'Busca utilizando la patente',
        search: 'Quiero saber más detalles sobre un móvil en particular',
    },
]

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
        <div className="flex flex-col gap-3 items-start justify-center w-full">
            {
                toolsList.map((tool, index) => (
                    <div key={index + 1} 
                        className="border p-2 bg-gray-50 hover:bg-gray-100 hover:cursor-pointer rounded-md shadow-md w-full flex items-center justify-start gap-3 text-muted-background"
                        onClick={() => handleClick({ tool })}
                    >
                        <Car className="size-5" />
                        <div className="grid gap-0.5">
                            <span>{ tool.name }</span>
                            <p className="text-xs text-muted-foreground" data-description>{ tool.hint }</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}