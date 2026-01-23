import { BufferGeometry, Float32BufferAttribute } from 'three';
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

function ringToGeometry(ring: number[][], radius: number): BufferGeometry {
	const points: number[] = [];
	for (const coord of ring) {
		const lng = coord[0];
		const lat = coord[1];
		const v = latLngToVector3(lat, lng, radius);
		points.push(v.x, v.y, v.z);
	}
	const geometry = new BufferGeometry();
	geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
	return geometry;
}

export function buildCountryGeometries(
	geojson: GeoJsonFeatureCollection,
	radius = 2.01
): BufferGeometry[] {
	const geometries: BufferGeometry[] = [];

	for (const feature of geojson.features) {
		const { geometry } = feature;
		if (!geometry) continue;

		if (geometry.type === 'Polygon') {
			const outerRing = (geometry.coordinates as number[][][])[0];
			geometries.push(ringToGeometry(outerRing, radius));
		} else if (geometry.type === 'MultiPolygon') {
			for (const polygon of geometry.coordinates as number[][][][]) {
				const outerRing = polygon[0];
				geometries.push(ringToGeometry(outerRing, radius));
			}
		}
	}

	return geometries;
}
