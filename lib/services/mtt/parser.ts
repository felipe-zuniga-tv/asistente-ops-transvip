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
    displayLabels: { [key: string]: string };
    data: {
      licensePlate?: string;
      serviceType?: string;
      vehicleStatus?: string;
      region?: string;
      manufacturingInfo?: string;
      vehicleModel?: string;
      serviceStatus?: string;
      serviceInfo?: string;
      serviceFleet?: string;
      responsible?: string;
      regulation?: string;
      message?: string;
    };
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
        displayLabels: { message: "Mensaje" },
        data: { message: errorMessage }
      }
    };
  }

  const serviceType = $("#MainContent_tipo_servicio").text().trim();
  const regulation = serviceType === "PÚBLICO - AEROPUERTO MINIBUS RECORRIDO VARIABLE" ? "DS211" : 
                    serviceType.includes("PRIVADO") ? "D80" : null;

  const details = {
    displayLabels: {
      licensePlate: "Patente",
      serviceType: "Tipo de Servicio",
      vehicleStatus: "Estado del Vehículo",
      region: "Región",
      manufacturingInfo: "Año de Fabricación",
      vehicleAge: "Antigüedad",
      vehicleModel: "Marca / Modelo",
      serviceStatus: "Estado del Servicio",
      serviceInfo: "Folio Servicio",
      serviceFleet: "Flota Asociada",
      responsible: "Responsable",
      regulation: "Regulación"
    },
    data: {
      // licensePlate: $("#MainContent_patenteT").text().trim(),
      serviceType,
      ...(regulation && { regulation }),
      vehicleStatus: $("#MainContent_estado_vehiculo").text().trim(),
      region: $("#MainContent_region").text().trim(),
      manufacturingInfo: $("#MainContent_anio_fabricacion").text().trim(),
      // vehicleAge: $("#MainContent_antiguedad_vehiculo").text().trim(),
      vehicleModel: $("#MainContent_marca").text().trim() + " " + $("#MainContent_modelo").text().trim(),
      serviceStatus: $("#MainContent_lblEstadoServicio").text().trim(),
      serviceInfo: $("#MainContent_folio_servicio").text().trim(),
      serviceFleet: $("#MainContent_flota_servicio").text().trim(),
      responsible: $("#MainContent_responsable_servicio").text().trim(),
    }
  };

  // Validate if we got any data
  if (Object.values(details.data).every(v => !v)) {
    return {
      status: "ERROR_PARSING",
      details: {
        displayLabels: { message: "Mensaje" },
        data: { message: "No se pudo extraer la información del vehículo ni del servicio" }
      }
    };
  }

  return {
    status: "ENCONTRADO",
    details
  };
} 