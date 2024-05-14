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