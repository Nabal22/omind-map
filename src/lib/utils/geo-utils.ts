import { geoContains } from 'd3-geo';
import type ThreeGlobe from 'three-globe';
import type * as THREE from 'three';

export interface GeoFeature {
	type: 'Feature';
	properties: {
		NAME: string;
		[key: string]: unknown;
	};
	geometry: {
		type: 'Polygon' | 'MultiPolygon';
		coordinates: number[][][] | number[][][][];
	};
}

export interface LatLng {
	lat: number;
	lng: number;
}

/**
 * Convert 3D point on sphere to lat/lng using three-globe's built-in method
 */
export function vector3ToLatLng(point: THREE.Vector3, globe: ThreeGlobe | null): LatLng {
	if (globe) {
		const coords = globe.toGeoCoords({ x: point.x, y: point.y, z: point.z });
		return { lat: coords.lat, lng: coords.lng };
	}
	// Fallback calculation
	const radius = point.length();
	const lat = 90 - Math.acos(point.y / radius) * (180 / Math.PI);
	const lng = ((270 + Math.atan2(point.x, point.z) * (180 / Math.PI)) % 360) - 180;
	return { lat, lng };
}

/**
 * Find which country contains a lat/lng point
 */
export function findCountryAtPoint(
	lat: number,
	lng: number,
	features: GeoFeature[]
): GeoFeature | null {
	for (const feature of features) {
		// Cast to any to satisfy d3-geo's strict typing
		if (geoContains(feature as any, [lng, lat])) {
			return feature;
		}
	}
	return null;
}

/**
 * Calculate the centroid of a country feature
 */
export function getCountryCentroid(feature: GeoFeature): LatLng {
	const coords =
		feature.geometry.type === 'MultiPolygon'
			? (feature.geometry.coordinates as number[][][][]).flat(2)
			: (feature.geometry.coordinates as number[][][]).flat();

	let sumLng = 0;
	let sumLat = 0;
	for (const coord of coords) {
		sumLng += coord[0];
		sumLat += coord[1];
	}
	return {
		lat: sumLat / coords.length,
		lng: sumLng / coords.length
	};
}

/**
 * Load GeoJSON data from URL
 */
export async function loadGeoJSON(url: string): Promise<GeoFeature[]> {
	const response = await fetch(url);
	const data = await response.json();
	return data.features;
}
