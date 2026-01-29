import { BufferGeometry, Float32BufferAttribute, type Vector3 } from 'three';
import { latLngToVector3 } from '$lib/data/artists';

interface GeoJsonGeometry {
	type: 'Polygon' | 'MultiPolygon';
	coordinates: number[][][] | number[][][][];
}

interface GeoJsonFeature {
	type: 'Feature';
	geometry: GeoJsonGeometry;
}

interface GeoJsonFeatureCollection {
	type: 'FeatureCollection';
	features: GeoJsonFeature[];
}

function ringToSegments(ring: number[][], radius: number, output: number[]): void {
	const verts: Vector3[] = [];
	for (const coord of ring) {
		verts.push(latLngToVector3(coord[1], coord[0], radius));
	}
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

export function buildCountryGeometry(
	geojson: GeoJsonFeatureCollection,
	radius = 2.01
): BufferGeometry {
	const segments: number[] = [];

	for (const feature of geojson.features) {
		const { geometry } = feature;
		if (!geometry) continue;

		if (geometry.type === 'Polygon') {
			const outerRing = (geometry.coordinates as number[][][])[0];
			ringToSegments(outerRing, radius, segments);
		} else if (geometry.type === 'MultiPolygon') {
			for (const polygon of geometry.coordinates as number[][][][]) {
				ringToSegments(polygon[0], radius, segments);
			}
		}
	}

	const geo = new BufferGeometry();
	geo.setAttribute('position', new Float32BufferAttribute(segments, 3));
	return geo;
}
