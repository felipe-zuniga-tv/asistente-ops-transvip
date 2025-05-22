"use server";

import { z } from "zod";
// import { parseMTTResponse, type ParsedMTTResponse } from "./parser"; // Original import for ParsedMTTResponse
import { parseMTTResponse } from "./parser";
import type { ParsedMTTResponse, MTTVehicleInfo } from "@/types/domain/mtt/types";

// Schema for the response data
// export interface MTTVehicleInfo { // Removed
//   licensePlate: string;
//   status: string;
//   lastUpdate: string;
//   details?: ParsedMTTResponse['details'];
//   error?: string;
// }

const licensePlateSchema = z.string().regex(/^[A-Z0-9]{6}$/, {
  message: "La patente debe tener 6 caracteres alfanuméricos",
});

const licensePlatesSchema = z.array(licensePlateSchema).min(1).max(50);

async function queryMTTWebsite(licensePlate: string): Promise<MTTVehicleInfo> {
  try {
    const response = await fetch("https://apps.mtt.cl/consultaweb/", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      },
      body: new URLSearchParams({
        "__VIEWSTATE": "/wEPDwUKMTc0MTY3NTE3MWQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgEFIGN0bDAwJE1haW5Db250ZW50JGltZ0J0bkNvbnN1bHRhctDHtqY8QLP6ma5aOaNH8wWo/hx1uPhNGh1v4peuVg8=",
        "__VIEWSTATEGENERATOR": "522DF3F1",
        "__EVENTTARGET": "",
        "__EVENTARGUMENT": "",
        "__EVENTVALIDATION": "/wEdAASJM4uUaVK+jmvS4YEub/2HIKnzPnVFgXAZ20CcrnWXzeHx18AZ0epHV1po9+JEZeBnTMb45aJIIeXNdhdxmB5yakObqeaaMd2mG/7Wdjt50HQ9i1HxqqQN0LiJfL2qHH0=",
        "ctl00$MainContent$ppu": licensePlate,
        "ctl00$MainContent$btn_buscar": "Buscar"
      }).toString()
    });

    const html = await response.text();
    const parsedResponse = parseMTTResponse(html);

    console.log(parsedResponse)
    
    return {
      licensePlate,
      status: parsedResponse.status,
      lastUpdate: new Date().toISOString(),
      details: parsedResponse.details,
    };
  } catch (error) {
    return {
      licensePlate,
      status: "ERROR",
      lastUpdate: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function getMTTVehicleInfo(licensePlate: string): Promise<MTTVehicleInfo> {
  const validatedPlate = licensePlateSchema.parse(licensePlate.toUpperCase());
  return queryMTTWebsite(validatedPlate);
}

export async function getMTTVehiclesInfo(licensePlates: string[]): Promise<MTTVehicleInfo[]> {
  const validatedPlates = licensePlatesSchema.parse(
    licensePlates.map(plate => plate.toUpperCase())
  );
  
  // Query all plates in parallel
  const results = await Promise.all(
    validatedPlates.map(plate => queryMTTWebsite(plate))
  );
  
  return results;
} 