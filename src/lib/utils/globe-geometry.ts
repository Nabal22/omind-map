import earcut from 'earcut';
import { latLngToVector3, type GeoJSONData, type CountryFeature } from '$lib/data/geo';

export interface CountryData {
	name: string;
	hasArtists: boolean;
	polygons: { vertices: Float32Array; indices: number[] }[];
}

export interface ProcessedGeoData {
	countries: CountryData[];
	borderPositions: Float32Array;
}

/** Unwrap longitudes to avoid dateline jumps (e.g., Russia/USA/China) */
function unwrapRing(ring: number[][]): number[][] {
	if (ring.length === 0) return ring;

	const unwrapped: number[][] = [ring[0]];
	let prevLng = ring[0][0];

	for (let i = 1; i < ring.length; i++) {
		let [lng, lat] = ring[i]; // eslint-disable-line prefer-const
		const diff = lng - prevLng;
		if (diff > 180) lng -= 360;
		else if (diff < -180) lng += 360;
		unwrapped.push([lng, lat]);
		prevLng = lng;
	}

	return unwrapped;
}

/** Recursively subdivide triangles in lat/lng space for smooth sphere projection */
function subdivideTriangle(
	coords: { lat: number; lng: number }[],
	radius: number,
	maxAngle: number,
	vertices: number[],
	indices: number[]
): void {
	const [c1, c2, c3] = coords;
	const edges = [
		Math.max(Math.abs(c1.lat - c2.lat), Math.abs(c1.lng - c2.lng)),
		Math.max(Math.abs(c2.lat - c3.lat), Math.abs(c2.lng - c3.lng)),
		Math.max(Math.abs(c3.lat - c1.lat), Math.abs(c3.lng - c1.lng))
	];
	const maxDist = Math.max(...edges);

	if (maxDist <= maxAngle) {
		// Triangle is small enough - project to sphere and add
		const baseIndex = vertices.length / 3;
		for (const c of coords) {
			const p = latLngToVector3(c.lat, c.lng, radius);
			vertices.push(p.x, p.y, p.z);
		}
		indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
		return;
	}

	// Split longest edge
	const maxEdgeIdx = edges.indexOf(maxDist);
	const [a, b] = [[c1, c2], [c2, c3], [c3, c1]][maxEdgeIdx];
	const mid = { lat: (a.lat + b.lat) / 2, lng: (a.lng + b.lng) / 2 };

	const triangles = [
		[[c1, mid, c3], [mid, c2, c3]],
		[[c1, c2, mid], [c1, mid, c3]],
		[[c1, c2, mid], [mid, c2, c3]]
	][maxEdgeIdx];

	for (const tri of triangles) {
		subdivideTriangle(tri as { lat: number; lng: number }[], radius, maxAngle, vertices, indices);
	}
}

function triangulatePolygon(
	ring: number[][],
	radius: number
): { vertices: Float32Array; indices: number[] } | null {
	if (ring.length < 3) return null;

	const unwrapped = unwrapRing(ring);
	const flat = unwrapped.flatMap(([lng, lat]) => [lng, lat]);
	const coords = unwrapped.map(([lng, lat]) => ({ lat, lng }));

	try {
		const originalIndices = earcut(flat, undefined, 2);
		if (originalIndices.length === 0) return null;

		const vertices: number[] = [];
		const indices: number[] = [];

		for (let i = 0; i < originalIndices.length; i += 3) {
			subdivideTriangle(
				[coords[originalIndices[i]], coords[originalIndices[i + 1]], coords[originalIndices[i + 2]]],
				radius,
				3,
				vertices,
				indices
			);
		}

		return indices.length ? { vertices: new Float32Array(vertices), indices } : null;
	} catch {
		return null;
	}
}

function buildBorderLines(ring: number[][], radius: number): number[] {
	const borders: number[] = [];
	for (let i = 0; i < ring.length - 1; i++) {
		const [lng1, lat1] = ring[i];
		const [lng2, lat2] = ring[i + 1];
		const v1 = latLngToVector3(lat1, lng1, radius);
		const v2 = latLngToVector3(lat2, lng2, radius);
		borders.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
	}
	return borders;
}

export function processGeoData(
	geoData: GeoJSONData,
	countriesWithArtists: Set<string>,
	fillRadius: number,
	borderRadius: number
): ProcessedGeoData {
	const countries: CountryData[] = [];
	const borders: number[] = [];

	for (const feature of geoData.features) {
		const name = feature.properties.NAME;
		const hasArtists = countriesWithArtists.has(name);
		const rawPolygons =
			feature.geometry.type === 'MultiPolygon'
				? feature.geometry.coordinates
				: [feature.geometry.coordinates];

		// Only create meshes for countries with artists (huge performance boost)
		const polygons: { vertices: Float32Array; indices: number[] }[] = [];

		for (const polygon of rawPolygons) {
			const ring = (polygon as number[][][])[0];
			if (!ring || ring.length < 3) continue;

			// Only triangulate countries with artists
			if (hasArtists) {
				const triangulated = triangulatePolygon(ring, fillRadius);
				if (triangulated) polygons.push(triangulated);
			}

			// Borders for all countries
			borders.push(...buildBorderLines(ring, borderRadius));
		}

		// Only add to countries array if it has polygons (i.e., has artists)
		if (polygons.length > 0) {
			countries.push({ name, hasArtists, polygons });
		}
	}

	return { countries, borderPositions: new Float32Array(borders) };
}

export function findCountryFeature(
	geoData: GeoJSONData,
	countryName: string
): CountryFeature | undefined {
	return geoData.features.find((f) => f.properties.NAME === countryName);
}
