import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from 'nanoid'

// Utility function to merge class names
export function cn(...inputs: string[]): string {
  return twMerge(clsx(inputs))
}

// Generate a unique ID
export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  10
) // 7-character random string

// Vehicle status constants
export const VEHICLE_STATUS = {
  OFFLINE: 0,
  ONLINE: 1,
  ONLINE_BUSY: 1,
  ONLINE_AVAILABLE: 2,
} as const

// Sleep function
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

// Driver rating summary interface
interface DriverRating {
  fleet_rating: number;
  fleet_comment: string;
}

export const getDriverRatingSummary = (driverRatings: DriverRating[]): Record<string, { count: number; comments: Record<string, number> }> => {
  const summary = driverRatings.reduce((acc, job) => {
    const rating = job.fleet_rating.toString();
    if (!acc[rating]) {
      acc[rating] = { count: 0, comments: {} };
    }
    acc[rating].count++;
    const comment = job.fleet_comment;
    if (!acc[rating].comments[comment]) {
      acc[rating].comments[comment] = 0; // Create an entry if it doesn't exist
    }
    acc[rating].comments[comment]++; // Increment the comment count

    return acc;
  }, {} as Record<string, { count: number; comments: Record<string, number> }>);

  return summary
}

// Airport zone interface
interface Zone {
  branch_id: string;
  regions: { region_name: string }[];
}

export const getAirportZone = (zones: Zone) => {
  const filter = zones.regions.filter(x => x.region_name.toLowerCase() === 'aeropuerto')
  const filteredZone = filter.length ? filter[0] : null

  if (!filteredZone) return

  return {
    branch_id: zones.branch_id,
    region: filteredZone
  }
}

export const calculateDuration = (entryTime: String, onlyDuration = true) => {
  const entry = new Date(entryTime as string)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - entry.getTime()) / 60000)
  return diffInMinutes
}