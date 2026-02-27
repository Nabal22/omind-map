import * as THREE from 'three';

export interface CountryFeature {
	type: 'Feature';
	properties: {
		NAME: string;
		ADMIN: string;
		ISO_A3: string;
		[key: string]: unknown;
	};
	geometry: {
		type: 'Polygon' | 'MultiPolygon';
		coordinates: number[][][] | number[][][][];
	};
}

export interface GeoJSONData {
	type: 'FeatureCollection';
	features: CountryFeature[];
}

export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
	const phi = (90 - lat) * (Math.PI / 180);
	const theta = (lng + 180) * (Math.PI / 180);

	return new THREE.Vector3(
		-(radius * Math.sin(phi) * Math.cos(theta)),
		radius * Math.cos(phi),
		radius * Math.sin(phi) * Math.sin(theta)
	);
}

export function getCountryCentroid(feature: CountryFeature): { lat: number; lng: number } {
	let ring: number[][];

	if (feature.geometry.type === 'MultiPolygon') {
		// Use the largest polygon (mainland) for centroid calculation
		const polygons = feature.geometry.coordinates as number[][][][];
		let largest = polygons[0];
		for (let i = 1; i < polygons.length; i++) {
			if (polygons[i][0].length > largest[0].length) {
				largest = polygons[i];
			}
		}
		ring = largest[0];
	} else {
		ring = (feature.geometry.coordinates as number[][][])[0];
	}

	let sumLng = 0;
	let sumLat = 0;

	for (const coord of ring) {
		sumLng += coord[0];
		sumLat += coord[1];
	}

	return {
		lng: sumLng / ring.length,
		lat: sumLat / ring.length
	};
}

export async function loadGeoJSON(url: string): Promise<GeoJSONData> {
	const response = await fetch(url);
	return response.json();
}
