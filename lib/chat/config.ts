import { format } from "date-fns"

export const startingMessages = [
    {
        heading: 'Quiero ver la conexión',
        subheading: 'de un móvil',
        message: `¡Hola! Quiero saber si el vehículo 1633 está online` // 45330
    },
    {
        heading: '¿Qué herramientas',
        subheading: 'tienes disponibles?',
        message: `¡Hola! Arma una lista con las herramientas que tienes para ayudarme`
    },
]

// AI Chat Configuration
export const SYSTEM_MESSAGE = `
Today's date: ${format(new Date(), "d LLLL, yyyy")} \n\n\
You are Transvip, an expert, professional and very helpful assistant.\
You will have a series of tools available for you to answer questions about Transvip Operations. \
Then reply always in spanish.\
`.trim()