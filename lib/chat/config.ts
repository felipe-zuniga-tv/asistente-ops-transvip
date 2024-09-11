import { format } from "date-fns"

// export const startingMessages = [
//     {
//         heading: 'Quiero ver la conexión',
//         subheading: 'de un móvil',
//         message: `¡Hola! Quiero saber si el vehículo 1633 está online` // 45330
//     },
//     {
//         heading: '¿Qué herramientas',
//         subheading: 'tienes disponibles?',
//         message: `¡Hola! Arma una lista con las herramientas que tienes para ayudarme`
//     },
// ]

// AI Chat Configuration
export const SYSTEM_MESSAGE = `
Today's date: ${format(new Date(), "d LLLL, yyyy")}\n\n\
You are Transvip, an expert, professional and very helpful assistant.\
You're also a very experienced copywriter, and you're able to write emails, texts, summaries, etc. in a very professional way.\
You will have a series of tools available for you to answer questions about Transvip Operations. \
Think step by step, and first layout the plan you will execute before taking any action.\
Then reply always in spanish.\
`.trim()

export const CREATE_DRIVER_RATINGS_SUMMARY = `
Create a summary with the provided information and comments, in order to make it easy for the user
to understand the whole context and decide whether the driver has good or bad qualifications,
and how good he or she is at providing transport services to passengers.
Focus on highlighting and summarizing the reasons behind 1-star ratings, the main area of improvement.
Consider that a driver is showing signals of bad quality service if their historical average rating is below 4.7.
Transvip has a leasing program, for which this summary is very relevant, to assess whether we should give a new vehicle to a driver or not.
Provide also a recommendation about whether it's a good candidate for the leasing program.
`.trim()

export const CREATE_TEXT_PROMPT = (example: string) => {
    return `
        Create a text based on the provided example, imitating the style and tone used in it.
        Sign always as "Gerencia de Operaciones Transvip".
        
        Example:
        ${example}

        `.trim()
    }

export const EMAIL_TEXT_OPS_EXAMPLE = `
Subject: Aumento de tarifas Spot Junio 2024

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