// @ts-nocheck
import "server-only";
import {
	getMutableAIState,
	getAIState,
	createAI,
	streamUI
} from "ai/rsc";
import { z } from "zod";
import { getSession } from "../auth";
import { VEHICLE_STATUS, getDriverRatingSummary, nanoid } from "@/lib/utils";
import { CREATE_DRIVER_RATINGS_SUMMARY, CREATE_TEXT_PROMPT, EMAIL_TEXT_OPS_EXAMPLE, SYSTEM_MESSAGE } from "../config/chat";
import { getVehicleStatus, getBookingInfo, getVehicleDetail, getDriverProfile, searchDriver, getDriverRatings, getBookings, getZonaIluminadaServices } from "./functions";
import { BotCard, AssistantMessage, LoadingMessage, UserMessage } from "@/components/chat/message";
import { VehicleStatusSearch } from "@/components/chat/search/vehicle-status-search";
import { BookingCard, BookingIdSearch } from "@/components/chat/search/booking-search";
import { IVehicleDetail, VehicleDetail } from "@/components/chat/search/vehicle-detail-search";
import { generateText } from "ai";
import { DriverProfile, IDriverProfile } from "@/components/chat/search/driver-profile-search";
import AirportStatus from "@/components/chat/airport/airport-status";
import { airportZones } from "../config/airport";
import QRCode from "react-qr-code";
// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { getMTTVehiclesInfo } from "../services/mtt/actions";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { VehicleInfoCard } from "@/components/mtt/vehicle-info-card";
import { getSystemConfigs } from "../services/system";

async function submitUserMessage(content: string) {
	"use server";
	const session = await getSession()
	const llmConfig = await getSystemConfigs('llm_model_name')
	const modelName = llmConfig?.value || 'gemini-2.0-flash-lite-preview-02-05' // fallback to default
	const modelInstanceGoogle = google(modelName)

	const aiState = getMutableAIState<typeof AI>();

	aiState.update({
		...aiState.get(),
		messages: [
			...aiState.get().messages,
			{
				role: "user",
				content: `${content.trim()}`,
			},
		],
	});

	const ui = await streamUI({
		model: modelInstanceGoogle,
		system: SYSTEM_MESSAGE,
		messages: aiState.get().messages.filter(m => m.role !== 'function'),
		text: ({ content, done }) => {
			if (done) {
				aiState.done({
					...aiState.get(),
					messages: [
						...aiState.get().messages,
						{
							role: "assistant",
							content: content.trim(),
						},
					],
				});
			}
			return <AssistantMessage content={content.trim()} />
		},
		tools: {
			getVehicleStatus: {
				description: `Útil para responder sobre el estado de un vehículo o móvil, es decir, para saber 
					si un vehículo o móvil se encuentra conectado a la aplicación de Transvip (online)
					o si no está conectado (offline)`.trim(),
				parameters: z.object({
					vehicleNumber: z
						.number()
						.describe("El número del vehículo o móvil del cual se necesita saber su status")
				}).required(),
				generate: async function* ({ vehicleNumber }) {
					yield <LoadingMessage text={`Buscando el status del móvil #${vehicleNumber}...`} />

					const vehicleStatus = await getVehicleStatus(vehicleNumber)
					// console.log(vehicleStatus);

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								role: 'assistant',
								content: `Mostrando información sobre el móvil: ${vehicleNumber}`
							},
						]
					})

					return vehicleStatus.status !== VEHICLE_STATUS.OFFLINE ? (
						<BotCard>
							<VehicleStatusSearch searchResults={[vehicleStatus]}
								content={content.text}
								session={session}
							/>
						</BotCard>
					) : (
						<BotCard>
							<div>El móvil {vehicleNumber} está desconectado de la app de Transvip.</div>
						</BotCard>
					)
				}
			},
			createBookingQrCode: {
				description: `Útil para crear un código QR a partir un número de reserva`,
				parameters: z.object({
					bookingId: z
						.number()
						.describe("El número o código de la reserva para el cual se creará un código QR"),
				}).required(),
				generate: async function* ({ bookingId }) {
					yield <LoadingMessage text={`Creando código QR para la reserva ${bookingId}...`} 
							className="text-xs md:text-base"
						/>

					const qrCodeValue = `{ "booking_id": ${bookingId}, "url": "www.transvip.cl/" }`

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								role: 'assistant',
								content: `Mostrando información de la reserva: ${bookingId}`
							},
						]
					})

					return qrCodeValue ? (
						<BotCard>
							<div className="h-[300px] bg-white p-6">
								<QRCode size={256}
									className="h-[300px] w-full"
									value={qrCodeValue}
									viewBox={`0 0 256 256`}
								/>
							</div>
						</BotCard>
					) : (
						<BotCard>
							<div>No se pudo encontrar la reserva o paquete con el código <span className="font-bold">{bookingId}</span>.</div>
						</BotCard>
					)
				}
			},
			getBookingInfo: {
				description: `Útil para obtener el detalle de una reserva o servicio solicitado en Transvip`,
				parameters: z.object({
					bookingId: z
						.number()
						.describe("El número o código de la reserva, servicio o paquete del cual se necesita saber su detalle"),
				}).required(),
				generate: async function* ({ bookingId }) {
					yield <LoadingMessage text={`Buscando la reserva/paquete ${bookingId}...`} 
							className="text-xs md:text-base"
						/>

					const not_shared_booking = await getBookingInfo(bookingId, false) // NOT SHARED
					const shared_booking     = await getBookingInfo(bookingId, true)  // SHAREDs
					const bookingInformation = not_shared_booking ? not_shared_booking : shared_booking

					console.log(bookingInformation)
					
					// Sort by Job Pickup datetime ascending
					bookingInformation?.
					sort((a, b) => String(a.dates.temp_pickup_time).localeCompare(String(b.dates.temp_pickup_time))).
						sort((a, b) => String(a.booking.job_time_utc).localeCompare(String(b.booking.job_time_utc)))
						// .sort((a, b) => String(a.booking.id).localeCompare(String(b.booking.id)))

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								role: 'assistant',
								content: `Mostrando información ${shared_booking ? 'del paquete' : 'la reserva'}: ${bookingId}`
							},
						]
					})

					return bookingInformation ? (
						<BotCard>
							<BookingIdSearch
								searchResults={bookingInformation}
								content={content.text}
								session={session}
							/>
						</BotCard>
					) : (
						<BotCard>
							<div>No se pudo encontrar la reserva o paquete con el código <span className="font-bold">{bookingId}</span>.</div>
						</BotCard>
					)
				}
			},
			getFutureBookings: {
				description: `Útil para obtener reservas futuras, programadas para las siguientes horas`,
				parameters: z.object({
					hours: z
						.number()
						.describe("El número de horas futuras para buscar las reservas"),
				}).required(),
				generate: async function* ({ hours }) {
					const futureHours = Math.min(hours, 6)
					yield <LoadingMessage text={`Usa máximo ${futureHours} horas en tu búsqueda...`} 
							className="text-xs md:text-base"
						/>

					yield <LoadingMessage text={`Buscando reservas en las próximas ${futureHours} horas...`} 
							className="text-xs md:text-base"
						/>

					const futureBookings = await getBookings(futureHours)
					// console.log(futureBookings);
					
					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								role: 'assistant',
								content: `Mostrando información de próximas reservas...`
							},
						]
					})

					return futureBookings ? (
						<BotCard>
							<span>Se encontraron {futureBookings.length} reserva{futureBookings.length > 1 ? 's' : ''}</span>
							{ futureBookings.map(fb => {
								return <BookingCard key={fb.booking.id} result={fb} simplified={true} />
							})}
						</BotCard>
					) : (
						<BotCard>
							<div>No se pudo encontrar reservas para las próximas horas.</div>
						</BotCard>
					)
				}
			},
			getVehicleInfo: {
				description: `Útil para obtener el detalle sobre un vehículo en particular (como status, marca, color, conductores asignados),
				y NO es para saber si está online. La búsqueda se realiza por patente, con formato ABCD12 (4 letras y 2 números).`,
				parameters: z.object({
					licensePlate: z
						.string()
						.describe(`El valor de la patente del vehículo del cual se necesita conocer su información.
							Tiene formato ABCD12 (4 letras y 2 números).`),
				}).required(),
				generate: async function* ({ licensePlate }) {
					yield <LoadingMessage text={`Buscando información del móvil PPU ${licensePlate}...`} />

					let vehicleInformation = null
					const lpRegex = new RegExp('^[A-Z]{2,4}[ ]*[0-9]{2,4}$') // LICENSE PLATE VALIDATION

					if (lpRegex.test(licensePlate.toUpperCase())) {
						vehicleInformation = await getVehicleDetail(licensePlate)
					}

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								role: 'assistant',
								content: `Mostrando información del móvil PPU ${licensePlate}`
							},
						]
					})

					return vehicleInformation ? (
						<BotCard>
							<VehicleDetail vehicleInformation={[vehicleInformation]} />
						</BotCard>
					) : (
						<BotCard>
							<div>No se pudo encontrar el móvil con PPU {licensePlate}.</div>
						</BotCard>
					)
				}
			},
			getDriverProfile: {
				description: `Utiliza esta función para obtener información general del perfil de un conductor
					de Transvip, como su nombre, teléfono, y otros. NO utilizar si se quiere armar un resumen de
					las evaluaciones del conductor.`,
				parameters: z.object({
					driverQuery: z
						.string()
						.describe(`El email o teléfono del conductor del cual se quiere buscar su perfil.`),
				}).required(),
				generate: async function* ({ driverQuery }) {
					// console.log(driverQuery)

					// Clean query
					let driverQueryClean = driverQuery.trim().replace("+", "").replace("  ", "")

					yield <LoadingMessage text={`Buscando conductor: ${driverQueryClean}...`}
						className="text-sm"
					/>

					const fleetId = await searchDriver(driverQueryClean)
					const driverProfile = await getDriverProfile(fleetId)

					// console.log(driverProfile)
					
					aiState.update({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								role: 'assistant',
								content: `Mostrando perfil del conductor ${driverProfile?.personal.email}`
							},
						]
					})

					return driverProfile ? (
						<BotCard>
							<DriverProfile driverProfile={driverProfile} />
						</BotCard>
					) : (
						<BotCard>
							<div>No se pudo encontrar el conductor utilizando: {driverQuery}.</div>
						</BotCard>
					)
				}
			},
			getDriverRatings: {
				description: `Utiliza esta función para construir un resumen de las evaluaciones que este conductor
					ha recibido de parte de los pasajeros en los últimos 90 días. Se realiza la búsqueda sólo por 
					email o por teléfono. NO utilizar si sólo se quiere obtener el perfil del conductor.`,
				parameters: z.object({
					driverQuery: z
						.string()
						.describe(`El email o teléfono del conductor del cual se quiere buscar su perfil.`),
				}).required(),
				generate: async function* ({ driverQuery }) {
					// Clean query
					let driverQueryClean = driverQuery.trim().replace("+", "").replace("  ", "")

					yield <LoadingMessage text={`Buscando conductor: ${driverQueryClean}`}
						className="text-sm"
					/>

					// Search driver by email
					const fleetId = await searchDriver(driverQueryClean)

					if (!fleetId) 
						return (
							<BotCard>
								<div>No se pudo encontrar el conductor usando {driverQueryClean}.</div>
							</BotCard>
						)
					
					// Get driver profile + ratings
					const driverProfile = await getDriverProfile(fleetId)
					const driverRatings = await getDriverRatings(fleetId)
					yield <LoadingMessage text={`Buscando evaluaciones del conductor...`} className="text-sm"/>
					
					const driverRatingsSummary = getDriverRatingSummary(driverRatings)
					yield <LoadingMessage text={`Armando resumen de las evaluaciones...`} className="text-sm"/>

					// Create text response for current search results
					const content = await generateText({
						model: modelInstanceGoogle,
						system: SYSTEM_MESSAGE + CREATE_DRIVER_RATINGS_SUMMARY,
						messages: [{
							role: 'assistant',
							content: `Evaluaciones del conductor ${driverProfile?.personal.full_name}, buscando con ${driverQuery}, últimos 90 días` +
								`\n\n` + `Resumen: ${JSON.stringify(driverRatingsSummary)}` + 
								`\n\n` + `Calificaciones bajas: ${JSON.stringify(driverRatingsSummary['1'])}` + 
								`\n\n` + `Calificación promedio histórica: ${driverProfile?.quality.avg_rating.toFixed(2)}`
						}],
					})

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								role: 'assistant',
								content: `Evaluaciones del conductor ${driverProfile?.personal.full_name}, buscando con ${driverQuery}, últimos 90 días` +
									`\n\n` + `Resumen: ${JSON.stringify(driverRatingsSummary)}` + 
									`\n\n` + `Calificaciones bajas: ${JSON.stringify(driverRatingsSummary['1'])}` + 
									`\n\n` + `Calificación promedio histórica: ${driverProfile?.quality.avg_rating.toFixed(2)}`
							}
						]
					})

					return driverRatings ? (
						<AssistantMessage content={content.text} session={session} />
					) : (
						<BotCard>
							<div>No se pudo encontrar el conductor <span className="rounded-full py-0.5">{ driverQueryClean }</span>.</div>
						</BotCard>
					)
				}
			},
			getAirportZone: {
				description: `Utiliza esta función para obtener el estado de la zona o región iluminada del aeropuerto de una ciudad.`,
				parameters: z.object({
					cityName: z
						.string()
						.describe(`El nombre de la ciudad del cual se requiere entender el status de la zona iluminada.
							Si no se entrega ningún valor, asumir que el valor es Santiago`),
				}).required(),
				generate: async function* ({ cityName }) {
					yield <LoadingMessage text={`Obteniendo status, ciudad: ${cityName}`} />

					const filteredConfig = airportZones.filter(city => city.city_name === cityName)
					const airportConfig = filteredConfig.length ? filteredConfig[0] : null

					if (!airportConfig) return null
					
					const services = await getZonaIluminadaServices(airportConfig.zone_id)

					return (
						<BotCard>
							<AirportStatus services={services} />
						</BotCard>
					)
				}
			},
			verifyMTTInformation: {
				description: `Útil para verificar el estado de uno o varios vehículos en el registro del MTT (Ministerio de Transportes y Telecomunicaciones).
					La búsqueda se realiza por patente, con formato ABCD12 (letras y números).`,
				parameters: z.object({
					licensePlates: z
						.array(z.string())
						.min(1)
						.max(50)
						.describe(`Lista de patentes de vehículos a consultar en el MTT. Cada patente debe tener formato ABCD12 (letras y números).`),
				}).required(),
				generate: async function* ({ licensePlates }) {
					yield <LoadingMessage text={`Consultando ${licensePlates.length} patente${licensePlates.length > 1 ? 's' : ''} en el MTT...`} />

					const results = await getMTTVehiclesInfo(licensePlates);

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								role: 'assistant',
								content: `Resultados de la consulta MTT para ${licensePlates.join(', ')}`
							},
						]
					});

					return (
						<BotCard>
							<div className="flex flex-col gap-4">
								{results.map((result, index) => (
									<VehicleInfoCard key={index} result={result} />
								))}
							</div>
						</BotCard>
					);
				}
			}
		},
	})

	aiState.done({
		...aiState.get(),
		messages: [
			...aiState.get().messages,
			{
				role: "assistant",
				content: content.trim(),
			},
		],
	});

	return {
		display: ui.value
	}
}

export type Message = {
	role: "user" | "assistant" | "system" | "function" | "data" | "tool";
	content: string;
	id?: string;
	name?: string;
	display?: {
		name: string;
		props: Record<string, any>;
	};
};

export type AIState = {
	chatId: string;
	interactions?: string[];
	messages: Message[];
};

export type UIState = {
	id: string;
	display: React.ReactNode;
	spinner?: React.ReactNode;
	attachments?: React.ReactNode;
}[];

export const AI = createAI<AIState, UIState>({
	actions: {
		submitUserMessage,
	},
	initialUIState: [],
	initialAIState: { chatId: nanoid(), interactions: [], messages: [] },
	onGetUIState: async () => {
		"use server";
		const session = await getSession()

		if (session) {
			const aiState = getAIState();

			if (aiState) {
				const uiState = getUIStateFromAIState(aiState);
				return uiState;
			}
		} else {
			return;
		}
	},
	onSetAIState: async ({ state }) => {
		"use server";
		const session = await getSession()

		if (session) {
			const { chatId, messages } = state;

			const createdAt = new Date();
			const userId = session.user.email;
			const path = `/chat/${chatId}`;
			const title = messages[0].content.substring(0, 100);

			const chat: Chat = {
				id: chatId,
				title,
				userId,
				createdAt,
				messages,
				path,
			};
			//   await saveChat(chat);
		} else {
			return;
		}
	},
});

export const getUIStateFromAIState = (aiState: Chat) => {
	return aiState.messages
		.filter(message => message.role !== 'system')
		.map((message, index) => ({
			id: `${aiState.chatId}-${index}`,
			display:
				message.role === 'function' ? (
					message.name === 'getVehicleStatus' ? (
						<BotCard>
							{message}
							<VehicleStatusSearch searchResults={message.content} content={message.content} />
						</BotCard>
					) : null
				) : message.role === 'user' ? (
					<UserMessage content={message.content} />
				) : (
					<AssistantMessage content={message.content} />
				)
		})
		)
}