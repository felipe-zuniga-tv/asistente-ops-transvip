import { Routes } from "@/utils/routes"
import { format } from "date-fns"
import { CarIcon, CarTaxiFrontIcon, Clock12Icon, FileDigitIcon, MapIcon, PencilIcon, PlaneTakeoffIcon, QrCodeIcon, User, UserSearch } from "lucide-react"
import { Tool } from "./types"

// AI Chat Configuration
export const SYSTEM_MESSAGE = `
Today's date: ${format(new Date(), "d LLLL, yyyy")}\n\n\
You are Transvip, an expert, professional and very helpful assistant.\
You're also a very experienced copywriter, and you're able to write emails, texts, summaries, etc. in a very professional way.\
You will have a series of tools available for you to answer questions about Transvip Operations. \
Try to find the right tool for the user's request. If none is applicable, then you can come up with the answer.\
Think step by step, and first layout the plan you will execute before taking any action.\
Then reply always in spanish.\
`.trim()

export const CREATE_DRIVER_RATINGS_SUMMARY = `
Create a summary with the provided information and comments, in order to make it easy for the user
to understand the whole context and decide whether the driver has good or bad qualifications,
and how good he or she is at providing transport services to passengers.\
Focus on highlighting and summarizing the reasons behind 1-star ratings, the main area of improvement.\
Consider that a driver is showing signals of bad quality service if their historical average rating is below 4.8.\
Transvip has a leasing program, for which this summary is very relevant, to assess whether we should give a new vehicle to a driver or not.\
Provide also a recommendation about whether it's a good candidate for the leasing program.
`.trim()

export const CREATE_TEXT_PROMPT = (example: string, subject: string) => {
    return `
Create a text based on the provided example, imitating the style and tone used in it.
Sign always as "Gerencia de Operaciones Transvip".

-- SUBJECT --
${subject}

-- EXAMPLE --
${example}
`.trim()
}

export const EMAIL_TEXT_OPS_EXAMPLE = `
Subject: 
Aumento de tarifas Spot Junio 2024

Content:

Estimado proveedor,
Queremos comunicarle una importante actualización respecto a las tarifas del convenio personal.
A partir del día 21 de junio de 2024, las tarifas de este convenio han sido aumentadas en aproximadamente un 2%, para los servicios compartidos y exclusivos, tanto en Recogida como en Zarpe. A modo de complemento, en casos donde también existan factores multiplicadores, éstos se aplicarán sobre estas nuevas tarifas. Considere que aún se podrá encontrar con reservas con los valores anteriores, pues este cambio aplica sólo para reservas nuevas creadas a partir de la fecha mencionada.
Esperemos que esta alza pueda traer beneficios, y podamos seguir prestando el servicio de calidad que siempre ofrecemos a nuestros pasajeros y clientes. Estamos convencidos de que esta actualización será positiva, tanto para usted como para la operación en general.
Le agradecemos por su compromiso continuo y su profesionalismo. Seguiremos trabajando para ofrecerle las mejores condiciones posibles y apoyarlo en su importante labor.
Si tiene alguna duda o requiere más información sobre este ajuste en las tarifas, no dude en ponerse en contacto con nuestro equipo de soporte.

Atentamente,
Gerencia de Operaciones Transvip
`.trim()

// TOOLS
export const toolsList: Tool[] = [
    //{
    //    title: 'Generar QR (con front)',
    //    hint: 'Ingresa el número de reserva',
    //    search: 'Necesito crear un código QR',
    //    icon: QrCodeIcon,
    //    url: Routes.QR_GEN
    //},
    {
        title: 'Generar QR en el chatbot',
        hint: 'Ingresa el número de reserva',
        search: 'Necesito crear un código QR a partir de un número de reserva',
        icon: QrCodeIcon,
    },
    {
        title: 'Escribir un texto',
        hint: 'Email, whatsapp, etc.',
        search: 'Necesito escribir un texto para los proveedores',
        icon: PencilIcon
    },
    {
        title: 'Zona Iluminada Santiago',
        hint: 'Status por tipo de vehículo',
        search: 'Quiero ver la zona iluminada del aeropuerto de Santiago',
        icon: PlaneTakeoffIcon,
    },
    {
        title: 'Conexión de un móvil',
        hint: 'Utiliza el número de móvil para la búsqueda',
        search: 'Me gustaría saber si un vehículo específico se encuentra conectado',
        icon: CarTaxiFrontIcon
    },
    {
        title: 'Detalle de un móvil',
        hint: 'Busca utilizando la patente',
        search: 'Quiero saber más detalles sobre un móvil en particular',
        icon: CarIcon
    },
    {
        title: 'Detalle por reserva o paquete',
        hint: 'Busca una reserva o paquete usando su código',
        search: 'Me gustaría saber más información sobre una reserva o paquete',
        icon: FileDigitIcon
    },
    {
        title: 'Reservas programadas',
        hint: 'Busca reservas para las próximas horas',
        search: 'Me gustaría buscar reservas programadas para las próximas horas',
        icon: Clock12Icon
    },
    {
        title: 'Perfil de un conductor',
        hint: 'Busca usando el email o teléfono',
        search: 'Quiero ver el perfil de un conductor en particular',
        icon: User
    },
    {
        title: 'Evaluaciones de un conductor',
        hint: 'Busca usando el email o teléfono',
        search: 'Quiero armar un resumen de las evaluaciones de un conductor en particular',
        icon: UserSearch
    },
    {
        title: 'Gestión de Geocercas',
        hint: 'Invierte las coordenadas',
        search: 'Necesito invertir las coordenadas de un texto en GeoJSON',
        icon: MapIcon
    },
]