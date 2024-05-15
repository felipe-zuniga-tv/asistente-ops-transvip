import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from 'nanoid'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  10
) // 7-character random string

export const VEHICLE_STATUS = {
  OFFLINE: 0,
  ONLINE: 1,
  ONLINE_BUSY: 1,
  ONLINE_AVAILABLE: 2,
}

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getDriverRatingSummary = (driverRatings) => {
  const summary = driverRatings.reduce((acc, job) => {
    const rating = job.fleet_rating;
    if (!acc[rating]) {
      acc[rating] = { count: 0, comments: [] };
    }
    acc[rating].count++;
    const comment = job.fleet_comment;
    if (!acc[rating].comments[comment]) {
      acc[rating].comments[comment] = 0; // Crea una entrada si no existe
    }
    acc[rating].comments[comment]++; // Incrementa el conteo del comentario

    return acc;
  }, {});

  return summary
}