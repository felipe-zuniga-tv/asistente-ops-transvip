import { Car, CarIcon, CarTaxiFrontIcon, Clock12Icon, FileDigitIcon, PlaneTakeoffIcon, User, UserSearch } from "lucide-react";
import { Tool } from "@/components/chat/panel/types";

// TOOLS
export const toolsList: Tool[] = [
    {
        title: 'Zona Iluminada Santiago',
        hint: 'Status por tipo de vehículo',
        search: 'Quiero ver la zona iluminada del aeropuerto de Santiago',
        icon: PlaneTakeoffIcon,
    },
    {
        title: 'Zona Iluminada Antofagasta',
        hint: 'Status por tipo de vehículo',
        search: 'Quiero ver la zona iluminada del aeropuerto de Antofagasta',
        icon: PlaneTakeoffIcon,
    },
    {
        title: 'Busca una PPU en el MTT',
        hint: 'Busca una patente en el MTT',
        search: 'Quiero buscar una patente en el MTT',
        icon: Car,
    },
    {
        title: 'Ver si un móvil está conectado',
        hint: 'Utiliza el número de móvil para la búsqueda',
        search: 'Me gustaría saber si un vehículo específico se encuentra conectado',
        icon: CarTaxiFrontIcon
    },
    {
        title: 'Detalle de un móvil',
        hint: 'Busca utilizando la patente',
        search: 'Busca más detalles sobre un vehículo en particular (como marca, modelo, etc)',
        icon: CarIcon
    },
    {
        title: 'Detalle por reserva o paquete',
        hint: 'Busca una reserva o paquete usando su código',
        search: 'Me gustaría saber más información sobre una reserva o paquete',
        icon: FileDigitIcon
    },
    {
        title: 'Reservas programadas',
        hint: 'Busca reservas de las próximas horas',
        search: 'Busca las reservas programadas para las próximas 4 horas',
        icon: Clock12Icon
    },
    {
        title: 'Perfil de un conductor',
        hint: 'Busca usando el email o teléfono',
        search: 'Quiero ver el perfil de un conductor en particular',
        icon: User
    },
    {
        title: 'Evaluaciones de un conductor',
        hint: 'Busca usando el email o teléfono',
        search: 'Quiero armar un resumen de las evaluaciones de un conductor en particular',
        icon: UserSearch
    },
]