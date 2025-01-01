import { CarIcon, CarTaxiFrontIcon, Clock12Icon, FileDigitIcon, MapIcon, PencilIcon, PlaneTakeoffIcon, QrCodeIcon, User, UserSearch } from "lucide-react";
import { Tool } from "../chat/types";

// TOOLS
export const toolsList: Tool[] = [
    {
        title: 'Escribir un texto',
        hint: 'Email, whatsapp, etc.',
        search: 'Necesito escribir un texto para los proveedores',
        icon: PencilIcon
    },
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
        title: 'Conexión de un móvil',
        hint: 'Utiliza el número de móvil para la búsqueda',
        search: 'Me gustaría saber si un vehículo específico se encuentra conectado',
        icon: CarTaxiFrontIcon
    },
    {
        title: 'Detalle de un móvil',
        hint: 'Busca utilizando la patente',
        search: 'Quiero saber más detalles sobre un móvil en particular',
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
        hint: 'Busca las reservas para las próximas horas',
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
    {
        title: 'Gestión de Geocercas',
        hint: 'Invierte las coordenadas',
        search: 'Necesito invertir las coordenadas de un texto en GeoJSON',
        icon: MapIcon
    },
]