// @ts-nocheck
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import "server-only";
import {
	getMutableAIState,
	getAIState,
	createAI,
	streamUI,
} from "ai/rsc";

import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { getSession } from "../lib";
import { VEHICLE_STATUS, nanoid } from "@/lib/utils";
import { CREATE_DRIVER_RATINGS_SUMMARY, SYSTEM_MESSAGE } from "./config";
import { getVehicleStatus, getBookingInfo, getVehicleDetail, getDriverProfile, searchDriver, getDriverRatings } from "./functions";
import { BotCard, AssistantMessage, LoadingMessage, UserMessage } from "@/components/chat/message";
import { VehicleStatusSearch } from "@/components/chat/search/vehicle-status-search";
import { BookingIdSearch } from "@/components/chat/search/booking-search";
import { VehicleDetail } from "@/components/chat/search/vehicle-detail-search";
import { generateText } from "ai";
import { DriverProfile } from "@/components/chat/search/driver-profile-search";

export const OPENAI_MODEL_NAME = 'gpt-3.5-turbo' // 'gpt-4'
const modelInstance = openai(OPENAI_MODEL_NAME)

async function submitUserMessage(content: string) {
	"use server";
	const session = await getSession()

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
		model: modelInstance,
		system: SYSTEM_MESSAGE,
		messages: [...aiState.get().messages.filter(m => m.role !== 'function')],
		text: ({ content, done }) => {
			if (done) {
				aiState.done({
					...aiState.get(),
					messages: [
						...aiState.get().messages,
						{
							role: "assistant",
							content: `${content.trim()}`,
						},
					],
				})
			}

			return <AssistantMessage content={content.trim()} />
		},
		tools: {
			getVehicleStatus: {
				description: `Útil para responder sobre el estado de un vehículo o móvil, es decir, para saber 
					si un vehículo o móvil se encuentra conectado a la aplicaciónd de Transvip (online)
					o si no está conectado (offline)`,
				parameters: z.object({
					vehicleNumber: z
						.number()
						.describe("El número del vehículo o móvil del cual se necesita saber su status"),
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

					// 	aiState.done({
					// 		...aiState.get(),
					// 		// interactions: [],
					// 		messages: [
					// 			...aiState.get().messages,
					// 			{
					// 				role: 'function',
					// 				name: 'getVehicleStatus',
					// 				content: JSON.stringify(vehicleStatus)
					// 			},
					// 		]
					// 	})

					// // Create text response for current search results
					// const content = await generateText({
					// 	model: modelInstance,
					// 	system: SYSTEM_MESSAGE,
					// 	// + "\n\nCreate 3 follow-up questions with the title FOLLOW UP",
					// 	messages: [...aiState.get().messages.filter(m => m.role !== "function")],
					// })

					// // Update AI State
					// aiState.update({
					// 	...aiState.get(),
					// 	messages: [
					// 		...aiState.get().messages.slice(0, -1),
					// 		{
					// 			role: 'assistant',
					// 			content: content.text.trim()
					// 		},
					// 	],
					// });

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
			getBookingInfo: {
				description: `Útil para obtener el detalle de una reserva o servicio solicitado en Transvip`,
				parameters: z.object({
					bookingId: z
						.number()
						.describe("El número o código de la reserva o servicio del cual se necesita saber su detalle"),
					isShared: z
						.boolean()
						.describe('Este campo es TRUE en caso de que se pregunte por un paquete, package o ID de un servicio compartido'),
				}).required(),
				generate: async function* ({ bookingId, isShared }) {
					yield <LoadingMessage text={`Buscando información de la reserva #${bookingId}...`} />
					
					const bookingInformation = await getBookingInfo(bookingId, isShared)
					// console.log(`RESERVA: ${bookingId} - IS SHARED: ${isShared}`);
					// console.log(bookingInformation);

					aiState.done({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								role: 'assistant',
								content: `Mostrando información ${isShared ? 'del paquete' : 'la reserva'}: ${bookingId}`
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
							<div>No se pudo encontrar la reserva o paquete con el código <span className="font-bold">{ bookingId }</span>.</div>
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
					const lpRegex = new RegExp('^[A-Z]{4}[ ]*[0-9]{2}$') // LICENSE PLATE VALIDATION

					if (lpRegex.test(licensePlate.toUpperCase())) {
						vehicleInformation = await getVehicleDetail(licensePlate)
						// console.log(vehicleInformation);
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
					de Transvip, como su nombre, teléfono, y otros. Se realiza la búsqueda sólo por email.`,
				parameters: z.object({
					driverEmail: z
						.string()
						.describe(`El email del conductor del cual se quiere buscar su perfil.`),
				}).required(),
				generate: async function* ({ driverEmail }) {
					yield <LoadingMessage text={`Buscando conductor con email ${driverEmail}...`}
							className="text-sm"
						/>

					const fleetId = await searchDriver(driverEmail)
					const driverProfile = await getDriverProfile(fleetId)
					// console.log(driverProfile);

					aiState.update({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								role: 'assistant',
								content: `Mostrando perfil del conductor con email ${driverEmail}`
							},
						]
					})

					return driverProfile ? (
						<BotCard>
							<DriverProfile driverProfile={driverProfile} />
							{/* <pre className="max-w-[400px]">{JSON.stringify(driverProfile)}</pre> */}
						</BotCard>
					) : (
						<BotCard>
							<div>No se pudo encontrar el conductor utilizando el email { driverEmail }.</div>
						</BotCard>
					)
				}
			},
			getDriverRatings: {
				description: `Utiliza esta función para construir un resumen de las evaluaciones que este conductor
					ha recibido de parte de los pasajeros. Por defecto, se buscan los últimos 90 días.
					Se realiza la búsqueda sólo por email.`,
				parameters: z.object({
					driverEmail: z
						.string()
						.describe(`El email del conductor del cual se quiere construir un resumen de sus evaluaciones`),
				}).required(),
				generate: async function* ({ driverEmail }) {
					yield <LoadingMessage text={`Buscando conductor con email ${driverEmail}...`}
							className="text-sm"
						/>

					const fleetId = await searchDriver(driverEmail)
					const driverRatings = await getDriverRatings(fleetId)
					// console.log(driverRatings);

					aiState.update({
						...aiState.get(),
						messages: [
							...aiState.get().messages,
							{
								role: 'assistant',
								content: `Mostrando evaluaciones del conductor de email ${driverEmail}`
							},
							{
								role: 'assistant',
								content: JSON.stringify(driverRatings)
							},
						]
					})

					// Create text response for current search results
					const content = await generateText({
						model: modelInstance,
						system: SYSTEM_MESSAGE + CREATE_DRIVER_RATINGS_SUMMARY,
						messages: [...aiState.get().messages.filter(m => m.role !== "function")],
					})

					return driverRatings ? (
						<AssistantMessage content={content.text} session={session} />
					) : (
						<BotCard>
							<div>No se pudo encontrar el conductor de email { driverEmail }.</div>
						</BotCard>
					)
				}
			},
		},
	})

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