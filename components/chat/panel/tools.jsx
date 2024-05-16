'use client'
import { useActions, useUIState } from "ai/rsc"
import { UserMessage } from "../message"
import { Car } from "lucide-react"
import { nanoid } from "nanoid"
import { TransvipLogo } from "@/components/transvip/transvip-logo"

const toolsList = [
    {
        name: 'Conexión de un móvil',
        hint: 'Utiliza el número de móvil para la búsqueda',
        search: 'Me gustaría saber si un vehículo específico se encuentra conectado'
    },
    {
        name: 'Detalle de un móvil',
        hint: 'Busca utilizando la patente',
        search: 'Quiero saber más detalles sobre un móvil en particular',
    },
    {
        name: 'Detalle por reserva o paquete',
        hint: 'Busca una reserva o paquete usando su código',
        search: 'Me gustaría saber más información sobre una reserva o paquete'
    },
    {
        name: 'Perfil de un conductor',
        hint: 'Busca usando el email',
        search: 'Quiero ver el perfil de un conductor en particular',
    },
    {
        name: 'Evaluaciones de un conductor',
        hint: 'Busca por el teléfono o email',
        search: 'Quiero armar un resumen de las evaluaciones de un conductor en particular',
    },
    {
        name: 'Gestión de Geocercas',
        hint: 'Invierte las coordenadas',
        search: 'Necesito invertir las coordenadas de un texto en GeoJSON',
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
        <div className="tools flex flex-col gap-3 items-start justify-center">
            <span className="font-normal">Selecciona una herramienta</span>	
            <div className="flex flex-col gap-3 items-start justify-center w-full">
                {
                    toolsList.map((tool, index) => (
                        <div key={index + 1} 
                            className="border p-2 bg-gray-50 hover:bg-gray-200 hover:cursor-pointer rounded-md shadow-md w-full flex items-center justify-start gap-3 text-muted-background"
                            onClick={() => handleClick({ tool })}
                        >
                            {/* <Car className="size-5" /> */}
                            <TransvipLogo logoOnly={true} colored={false} size={20} className="bg-transvip p-1 rounded-md" />
                            <div className="grid gap-0.5">
                                <span>{ tool.name }</span>
                                <p className="text-xs text-muted-foreground" data-description>{ tool.hint }</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}