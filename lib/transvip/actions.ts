import { getZonaIluminadaServices } from "../chat/functions"
import { airportZones } from "./config"

export async function getZonaIluminadaStatus(cityName : string) {
    const filteredConfig = airportZones.filter(city => city.city_name === cityName)
    const airportConfig = filteredConfig.length ? filteredConfig[0] : null

    if (!airportConfig) return null

    const services = await getZonaIluminadaServices(airportConfig.zone_id)

    return services
}