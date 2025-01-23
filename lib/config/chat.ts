import { format } from "date-fns"

// AI Chat Configuration
export const SYSTEM_MESSAGE = `
Today's date: ${format(new Date(), "d LLLL, yyyy")}\n\n\
You are Transvip, an expert, professional and very helpful assistant. \
You're also a very experienced copywriter, and you're able to write emails, texts, summaries, etc. in a very professional way. \
If asked to write a text, just output that content and don't layout any plan at all. \
You will also have a set of tools available for you to answer questions about Transvip Operations. \
Try to find the right tool for the user's request. If none is applicable, then you can come up with the answer. \
Then reply always in spanish.
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

export const CREATE_TEXT_PROMPT = (variations: number, writingStyle: string, objective: string, example: string) => {
    return `
Create ${variations} variations of a text based on the provided example, each with a 'subject' and 'content' as result. 
Use a ${writingStyle} style when writing, and a tone that goes along with it.
Avoid words like "Trabajador", "Colaborador", "Empleado" and other similar words.
Refer to the user as "proveedor", when requested to write a text for a provider.
Sign always as "Gerencia de Operaciones Transvip".

The goal of the text is to communicate:
-- OBJECTIVE --
${objective}

-- EXAMPLE --
${example}

-- OUTPUT FORMAT --
Output only the result, in JSON format with the following schema:
{
  texts: // array of variations
}
`.trim()
}

export const EMAIL_TEXT_OPS_EXAMPLE = `
SUBJECT 
Aumento de tarifas Spot Junio 2024

CONTENT
Estimado proveedor,
Queremos comunicarle una importante actualización respecto a las tarifas del convenio personal.
A partir del día 21 de junio de 2024, las tarifas de este convenio han sido aumentadas en aproximadamente un 2%, para los servicios compartidos y exclusivos, tanto en Recogida como en Zarpe. A modo de complemento, en casos donde también existan factores multiplicadores, éstos se aplicarán sobre estas nuevas tarifas. Considere que aún se podrá encontrar con reservas con los valores anteriores, pues este cambio aplica sólo para reservas nuevas creadas a partir de la fecha mencionada.
Esperemos que esta alza pueda traer beneficios, y podamos seguir prestando el servicio de calidad que siempre ofrecemos a nuestros pasajeros y clientes. Estamos convencidos de que esta actualización será positiva, tanto para usted como para la operación en general.
Le agradecemos por su compromiso continuo y su profesionalismo. Seguiremos trabajando para ofrecerle las mejores condiciones posibles y apoyarlo en su importante labor.
Si tiene alguna duda o requiere más información sobre este ajuste en las tarifas, no dude en ponerse en contacto con nuestro equipo de soporte.

Atentamente,
Gerencia de Operaciones Transvip
`.trim()