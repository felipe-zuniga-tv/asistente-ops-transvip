import { load } from "cheerio";

export interface VehicleDetails {
  plateNumber: string;
  rntEntryDate: string;
  serviceType: string;
  capacity: string;
  vehicleStatus: string;
  region: string;
  manufacturingYear: string;
  seatbeltRequired: string;
  vehicleAge: string;
  brand: string;
  model: string;
}

export interface ServiceDetails {
  serviceId: string;
  associatedFleet: string;
  serviceResponsible: string;
  serviceStatus: string;
}

export interface ParsedMTTResponse {
  status: "ENCONTRADO" | "NO_ENCONTRADO" | "ERROR_PARSING";
  details?: {
    [key: string]: string;
  };
}

export function parseMTTResponse(html: string): ParsedMTTResponse {
  const $ = load(html);
  
  // Check for error messages
  const errorMessage = $("#MainContent_lblError").text().trim();
  if (errorMessage) {
    return {
      status: "NO_ENCONTRADO",
      details: {
        message: errorMessage
      }
    };
  }

  // Parse all information into a flat structure
  const details: { [key: string]: string } = {
    "Patente": $("#MainContent_patenteT").text().trim(),
    // "Fecha Ingreso RNT": $("#MainContent_FechaIngresoRNT").text().trim(),
    "Tipo de Servicio": $("#MainContent_tipo_servicio").text().trim(),
    // "Capacidad": $("#MainContent_capacidad").text().trim(),
    "Estado del Vehículo": $("#MainContent_estado_vehiculo").text().trim(),
    "Región": $("#MainContent_region").text().trim(),
    "Año de Fabricación": $("#MainContent_anio_fabricacion").text().trim(),
    // "Cinturón Obligatorio": $("#MainContent_cinturon").text().trim(),
    "Antigüedad": $("#MainContent_antiguedad_vehiculo").text().trim(),
    "Marca / Modelo": $("#MainContent_marca").text().trim() + " " + $("#MainContent_modelo").text().trim(),
    // "Marca": $("#MainContent_marca").text().trim(),
    // "Modelo": $("#MainContent_modelo").text().trim(),
    "Folio Servicio": $("#MainContent_folio_servicio").text().trim(),
    "Flota Asociada": $("#MainContent_flota_servicio").text().trim(),
    "Responsable": $("#MainContent_responsable_servicio").text().trim(),
    "Estado del Servicio": $("#MainContent_lblEstadoServicio").text().trim(),
  };

  // Validate if we got any data
  if (Object.values(details).every(v => !v)) {
    return {
      status: "ERROR_PARSING",
      details: {
        message: "No se pudo extraer la información del vehículo ni del servicio"
      }
    };
  }

  return {
    status: "ENCONTRADO",
    details
  };
} 