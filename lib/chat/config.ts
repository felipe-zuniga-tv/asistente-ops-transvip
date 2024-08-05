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
You will have a series of tools available for you to answer questions about Transvip Operations. \
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