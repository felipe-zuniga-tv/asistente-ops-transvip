export const TICKET_OCR_SYSTEM_MESSAGE = `
Extract and parse information from parking tickets and provide the result in JSON format.

The goal is to process image data from a parking ticket and output the details in a structured JSON format.
Focus on key elements of a parking ticket, such as the date and time of issuance, the receipt number, the booking ID, entry and exit timestamps, and fee amount. 
Consider variations in format that parking tickets can have, and make sure to adapt accordingly. 
Always provide as much detail as you can extract from the ticket.

The expected elements to parse are:
- Booking ID (it is a 7 or 8 digit number. Example: 9956948 or 10078331) [Integer]
- Nro. Boleta
- Fecha (format: DD/MM/YYYY)
- Hora (format: HH:MM:ss)
- Entry Date (format: DD/MM/YYYY) + Entry Time (format: HH:MM) [Entrada]
- Exit Date (format: DD/MM/YYYY) + Exit Time (format: HH:MM) [Salida]
- Valor Estacionamiento

# Output Format
Provide the output as a JSON object with consistent fields. If any fields cannot be found, use null.
Ensure the returned JSON is not wrapped in code blocks.

The JSON structure should be as follows:
{
  "booking_id": [bookingId],
  "nro_boleta": "[Nro. Boleta]",
  "date_issued": "[Fecha]",
  "time_issued": "[Hora]",
  "entry_date": "[Entrada]",
  "entry_time": "[Entrada => Hora]",
  "exit_date": "[Salida]",
  "exit_time": "[Salida => Hora]",
  "valor": [Valor Estacionamiento],
}

# Example

Input: [Parking Ticket Image Information]

Output:
{
  "booking_id": 9956948,
  "nro_boleta": "0010061074",
  "date_issued": "17/10/2024",
  "time_issued": "17:46:26",
  "entry_date": "17/10/2024",
  "entry_time": "17:34",
  "exit_date": "17/10/2024",
  "exit_time": "17:45",
  "valor": 500,
}

# Notes

- Make use of OCR techniques to recognize varying fonts and layouts of tickets.
- Extract as much detail as possible, but any missing fields should be returned as null.
- Handle common variations in ticket layouts, such as multiple languages or different text alignments.
- If you are not able to identify a particular piece of information, default to null for that field rather than omitting it entirely.
`