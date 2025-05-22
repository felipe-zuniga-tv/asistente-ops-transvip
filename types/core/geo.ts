export interface Point {
  type: 'Point';
  coordinates: number[]; // [longitude, latitude, ?altitude]
}

export interface MultiPoint {
  type: 'MultiPoint';
  coordinates: number[][];
}

export interface LineString {
  type: 'LineString';
  coordinates: number[][]; // Array of points
}

export interface MultiLineString {
  type: 'MultiLineString';
  coordinates: number[][][]; // Array of LineStrings
}

export interface Polygon {
  type: 'Polygon';
  coordinates: number[][][]; // Array of linear rings (LineStrings)
}

export interface MultiPolygon {
  type: 'MultiPolygon';
  coordinates: number[][][][]; // Array of Polygons
}

export type Geometry = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon | GeometryCollection;

export interface GeometryCollection {
  type: 'GeometryCollection';
  geometries: Geometry[];
}

export interface Feature {
  type: 'Feature';
  geometry: Geometry | null;
  properties: Record<string, any> | null;
  id?: string | number;
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
  bbox?: number[]; // [minLon, minLat, maxLon, maxLat]
}

export type GeoJSON = Geometry | Feature | FeatureCollection; 