import { getSession } from "@/lib/core/auth"
import { airportZones } from "@/lib/core/config/airport"
import { branches } from "@/lib/core/config"
import { ZONA_ILUMINADA_CITY, ZONA_ILUMINADA_SERVICES, AIRPORT_ZONE_API_URL } from "@/lib/core/config/urls"
import { getResponseFromURL } from "@/lib/core/utils/helpers"
import { IAirportZone, IZonaIluminadaCity, IZonaIluminadaService } from "@/types/domain/chat/models"

export async function getZonaIluminada(cityName = 'Santiago') {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const branch = branches.find(x => x.name === cityName)
    const branchId = branch ? branch.branch_id : null

    if (!branchId) return
    
    const params = [
        `access_token=${accessToken}`,
        `branch_id=${branchId}`,
    ].join("&")

    const { status, data } = await getResponseFromURL(`${ZONA_ILUMINADA_CITY}?${params}`)

    if (status !== 200) return

    const { data: results } = data

    return {
        branch_id: branchId,
        regions: results
    }
}

export async function getZonaIluminadaServices(zone_id: number) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string
    
    const params = [
        `access_token=${accessToken}`,
        `zone_id=${zone_id}`,
    ].join("&")

    const { status, data } = await getResponseFromURL(`${ZONA_ILUMINADA_SERVICES}?${params}`)

    if (status !== 200) return

    const { data: results } = data

    return results
}

export async function getAirportStatus(branchId : number, zoneId: number, vehicle_id_list: string) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const params = [
        `access_token=${accessToken}`,
        `branch_id=${branchId}`,
        `zone_id=${zoneId}`,
        'offset=0',
        'limit=200',
        `vehicle_id=%5B${vehicle_id_list}%5D`
    ].join("&")

    const { status, data } = await getResponseFromURL(`${AIRPORT_ZONE_API_URL}?${params}`)

    if (status !== 200) return null

    const { result } = data

    return result
} 