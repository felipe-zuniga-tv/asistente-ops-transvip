import { buildAPIUrl } from "@/lib/services/utils/helpers"

export const VEHICLE_STATUS_API_URL  = buildAPIUrl(process.env.GET_VEHICLE_STATUS)
export const VEHICLE_DETAIL_API_URL  = buildAPIUrl(process.env.GET_VEHICLE_DETAIL)
export const DRIVER_SEARCH_API_URL   = buildAPIUrl(process.env.SEARCH_DRIVER)
export const DRIVER_PROFILE_API_URL  = buildAPIUrl(process.env.GET_DRIVER_PROFILE)
export const DRIVER_RATINGS_API_URL  = buildAPIUrl(process.env.GET_DRIVER_RATINGS)
export const BOOKING_DETAIL_URL      = buildAPIUrl(process.env.GET_BOOKING_DETAIL)
export const BOOKING_INFO_FULL_URL   = buildAPIUrl(process.env.GET_BOOKING_INFO_FULL)
export const BOOKING_ID_API_URL      = buildAPIUrl(process.env.GET_BOOKING_BY_ID)
export const ZONA_ILUMINADA_CITY     = buildAPIUrl(process.env.GET_ZONA_ILUMINADA_CITY)
export const ZONA_ILUMINADA_SERVICES = buildAPIUrl(process.env.GET_ZONA_ILUMINADA_SERVICES)
export const AIRPORT_ZONE_API_URL    = buildAPIUrl(process.env.GET_STATUS_AIRPORT_CITY)
export const CUSTOMER_SIGNUP_API_URL = buildAPIUrl(process.env.CUSTOMER_SIGNUP) 