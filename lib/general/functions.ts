export function invertCoordinatesGeoJson(coordinates : string) {
    const baseCoordinates = JSON.parse(coordinates) as { type: string; geometry: { type: string; coordinates: number[][][] } };
    
    const coordinatesArray: number[][] = baseCoordinates.geometry.coordinates[0].map(c => c.reverse());
    const outputCoordinates = {
        type: baseCoordinates.type,
        coordinates: [coordinatesArray]
    }

    return outputCoordinates
}