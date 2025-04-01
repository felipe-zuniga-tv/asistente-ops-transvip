/**
 * Inverts coordinates in a GeoJSON object by swapping longitude and latitude values.
 * @param input - GeoJSON string or object
 * @returns The processed GeoJSON object with inverted coordinates
 */
export function invertCoordinatesGeoJson(input: string | object): object {
  try {
    // Parse input if it's a string
    const geoJson = typeof input === 'string' ? JSON.parse(input) : input;
    
    // Process the GeoJSON object
    const processedGeoJson = processCoordinates(geoJson);
    
    return processedGeoJson;
  } catch (error) {
    throw new Error(`Failed to process GeoJSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Recursively processes GeoJSON object to invert coordinates
 */
function processCoordinates(geoJson: any): any {
  // Handle null or undefined
  if (!geoJson) return geoJson;

  // Process based on GeoJSON type
  if (geoJson.type === 'FeatureCollection' && Array.isArray(geoJson.features)) {
    return {
      ...geoJson,
      features: geoJson.features.map(processCoordinates)
    };
  }

  if (geoJson.type === 'Feature' && geoJson.geometry) {
    return {
      ...geoJson,
      geometry: processCoordinates(geoJson.geometry)
    };
  }

  // Process geometry types
  if (geoJson.type === 'Point' && Array.isArray(geoJson.coordinates)) {
    return {
      ...geoJson,
      coordinates: invertCoordinate(geoJson.coordinates)
    };
  }

  if (geoJson.type === 'LineString' && Array.isArray(geoJson.coordinates)) {
    return {
      ...geoJson,
      coordinates: geoJson.coordinates.map(invertCoordinate)
    };
  }

  if (geoJson.type === 'Polygon' && Array.isArray(geoJson.coordinates)) {
    return {
      ...geoJson,
      coordinates: geoJson.coordinates.map((ring: number[][]) => ring.map(invertCoordinate))
    };
  }

  if (geoJson.type === 'MultiPoint' && Array.isArray(geoJson.coordinates)) {
    return {
      ...geoJson,
      coordinates: geoJson.coordinates.map(invertCoordinate)
    };
  }

  if (geoJson.type === 'MultiLineString' && Array.isArray(geoJson.coordinates)) {
    return {
      ...geoJson,
      coordinates: geoJson.coordinates.map((line: number[][]) => line.map(invertCoordinate))
    };
  }

  if (geoJson.type === 'MultiPolygon' && Array.isArray(geoJson.coordinates)) {
    return {
      ...geoJson,
      coordinates: geoJson.coordinates.map((polygon: number[][][]) => 
        polygon.map((ring: number[][]) => ring.map(invertCoordinate))
      )
    };
  }

  if (geoJson.type === 'GeometryCollection' && Array.isArray(geoJson.geometries)) {
    return {
      ...geoJson,
      geometries: geoJson.geometries.map(processCoordinates)
    };
  }

  // Return the object as is if it doesn't match any GeoJSON type
  return geoJson;
}

/**
 * Inverts a single coordinate by swapping its elements
 * For GeoJSON, coordinates are typically [longitude, latitude]
 * This function swaps them to [latitude, longitude] or vice versa
 */
function invertCoordinate(coord: number[]): number[] {
  if (!Array.isArray(coord) || coord.length < 2) {
    return coord;
  }
  
  // Create a new array with swapped first two elements
  return [coord[1], coord[0], ...coord.slice(2)];
} 