import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';
import { geoPath, geoOrthographic, type GeoPermissibleObjects } from 'd3-geo';
import type { FeatureCollection, Geometry } from 'geojson';

/**
 * Convert lat/lng to 3D coordinates on a sphere
 */
function latLngToVector3(lat: number, lng: number, radius: number): Vector3 {
	const phi = (90 - lat) * (Math.PI / 180);
	const theta = (lng + 180) * (Math.PI / 180);

	const x = -(radius * Math.sin(phi) * Math.cos(theta));
	const y = radius * Math.cos(phi);
	const z = radius * Math.sin(phi) * Math.sin(theta);

	return new Vector3(x, y, z);
}

/**
 * Extract ring coordinates from GeoJSON using d3-geo path context
 */
function extractRings(geometry: GeoPermissibleObjects): number[][][] {
	const rings: number[][][] = [];

	// Custom path context to capture coordinates
	const context = {
		_ring: [] as number[][],
		beginPath() {},
		moveTo(x: number, y: number) {
			this._ring = [[x, y]];
		},
		lineTo(x: number, y: number) {
			this._ring.push([x, y]);
		},
		closePath() {
			if (this._ring.length > 0) {
				rings.push(this._ring);
				this._ring = [];
			}
		},
		arc() {}
	};

	// Use identity projection to get raw coordinates
	const path = geoPath()
		.projection(null) // null projection = identity (raw lat/lng)
		.context(context as unknown as CanvasRenderingContext2D);

	path(geometry);

	return rings;
}

/**
 * Convert a ring of [lng, lat] coordinates to line segments in 3D
 */
function ringToSegments(ring: number[][], radius: number, output: number[]): void {
	if (ring.length < 2) return;

	const verts = ring.map((coord) => latLngToVector3(coord[1], coord[0], radius));

	for (let i = 0; i < verts.length - 1; i++) {
		const a = verts[i];
		const b = verts[i + 1];
		output.push(a.x, a.y, a.z, b.x, b.y, b.z);
	}

	// Close the loop
	const last = verts[verts.length - 1];
	const first = verts[0];
	output.push(last.x, last.y, last.z, first.x, first.y, first.z);
}

/**
 * Build Three.js BufferGeometry from GeoJSON FeatureCollection
 * Uses d3-geo for proper geographic data handling
 */
export function buildCountryGeometry(
	geojson: FeatureCollection<Geometry>,
	radius = 2.01
): BufferGeometry {
	const segments: number[] = [];

	for (const feature of geojson.features) {
		if (!feature.geometry) continue;

		const rings = extractRings(feature.geometry);
		for (const ring of rings) {
			ringToSegments(ring, radius, segments);
		}
	}

	const geo = new BufferGeometry();
	geo.setAttribute('position', new Float32BufferAttribute(segments, 3));
	return geo;
}

/**
 * Create a d3-geo orthographic projection centered on specific coordinates
 */
export function createGlobeProjection(centerLng = 0, centerLat = 0, scale = 200) {
	return geoOrthographic()
		.scale(scale)
		.translate([0, 0])
		.rotate([-centerLng, -centerLat, 0]);
}
