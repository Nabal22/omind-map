import * as THREE from 'three';
import earcut from 'earcut';

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

const EARTH_RADIUS = 1;

export function latLngToVector3(lat: number, lng: number, radius: number = EARTH_RADIUS): THREE.Vector3 {
	const phi = (90 - lat) * (Math.PI / 180);
	const theta = (lng + 180) * (Math.PI / 180);

	const x = -(radius * Math.sin(phi) * Math.cos(theta));
	const y = radius * Math.cos(phi);
	const z = radius * Math.sin(phi) * Math.sin(theta);

	return new THREE.Vector3(x, y, z);
}

export function getCountryCentroid(feature: CountryFeature): { lat: number; lng: number } {
	const coords = feature.geometry.type === 'MultiPolygon'
		? feature.geometry.coordinates.flat(2)
		: feature.geometry.coordinates.flat();

	let sumLng = 0;
	let sumLat = 0;
	let count = 0;

	for (const coord of coords as number[][]) {
		sumLng += coord[0];
		sumLat += coord[1];
		count++;
	}

	return {
		lng: sumLng / count,
		lat: sumLat / count
	};
}

export function createCountryMesh(
	feature: CountryFeature,
	radius: number = EARTH_RADIUS
): THREE.Mesh | THREE.Group {
	const geometry = feature.geometry;
	const polygons = geometry.type === 'MultiPolygon'
		? geometry.coordinates
		: [geometry.coordinates];

	const group = new THREE.Group();
	group.name = feature.properties.NAME;
	group.userData = {
		countryName: feature.properties.NAME,
		admin: feature.properties.ADMIN,
		iso: feature.properties.ISO_A3
	};

	for (const polygon of polygons) {
		const mesh = createPolygonMesh(polygon as number[][][], radius);
		if (mesh) {
			group.add(mesh);
		}
	}

	return group;
}

function createPolygonMesh(
	polygon: number[][][],
	radius: number
): THREE.Mesh | null {
	const outerRing = polygon[0];
	if (!outerRing || outerRing.length < 3) return null;

	const vertices: number[] = [];
	const flatVertices: number[] = [];

	for (const coord of outerRing) {
		const [lng, lat] = coord;
		flatVertices.push(lng, lat);

		const vec = latLngToVector3(lat, lng, radius * 1.001);
		vertices.push(vec.x, vec.y, vec.z);
	}

	try {
		const indices = earcut(flatVertices, undefined, 2);
		if (indices.length === 0) return null;

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		geometry.setIndex(indices);
		geometry.computeVertexNormals();

		const material = new THREE.MeshBasicMaterial({
			color: 0x000000,
			transparent: true,
			opacity: 0,
			side: THREE.DoubleSide
		});

		return new THREE.Mesh(geometry, material);
	} catch {
		return null;
	}
}

export function createCountryBorders(
	features: CountryFeature[],
	radius: number = EARTH_RADIUS
): THREE.LineSegments {
	const positions: number[] = [];

	for (const feature of features) {
		const geometry = feature.geometry;
		const polygons = geometry.type === 'MultiPolygon'
			? geometry.coordinates
			: [geometry.coordinates];

		for (const polygon of polygons) {
			for (const ring of polygon as number[][][]) {
				for (let i = 0; i < ring.length - 1; i++) {
					const [lng1, lat1] = ring[i];
					const [lng2, lat2] = ring[i + 1];

					const v1 = latLngToVector3(lat1, lng1, radius * 1.002);
					const v2 = latLngToVector3(lat2, lng2, radius * 1.002);

					positions.push(v1.x, v1.y, v1.z);
					positions.push(v2.x, v2.y, v2.z);
				}
			}
		}
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

	const material = new THREE.LineBasicMaterial({
		color: 0xffaef6,
		transparent: true,
		opacity: 0.6
	});

	return new THREE.LineSegments(geometry, material);
}

export function createGlobe(radius: number = EARTH_RADIUS): THREE.Mesh {
	const geometry = new THREE.SphereGeometry(radius, 64, 64);
	const material = new THREE.MeshBasicMaterial({
		color: 0x0a0a0a,
		transparent: true,
		opacity: 0.95
	});

	return new THREE.Mesh(geometry, material);
}

export function createGlobeGrid(radius: number = EARTH_RADIUS): THREE.LineSegments {
	const positions: number[] = [];
	const gridOpacity = 0.15;

	for (let lat = -80; lat <= 80; lat += 20) {
		for (let lng = -180; lng < 180; lng += 2) {
			const v1 = latLngToVector3(lat, lng, radius * 1.001);
			const v2 = latLngToVector3(lat, lng + 2, radius * 1.001);
			positions.push(v1.x, v1.y, v1.z);
			positions.push(v2.x, v2.y, v2.z);
		}
	}

	for (let lng = -180; lng < 180; lng += 20) {
		for (let lat = -90; lat < 90; lat += 2) {
			const v1 = latLngToVector3(lat, lng, radius * 1.001);
			const v2 = latLngToVector3(lat + 2, lng, radius * 1.001);
			positions.push(v1.x, v1.y, v1.z);
			positions.push(v2.x, v2.y, v2.z);
		}
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

	const material = new THREE.LineBasicMaterial({
		color: 0xffaef6,
		transparent: true,
		opacity: gridOpacity
	});

	return new THREE.LineSegments(geometry, material);
}

export async function loadGeoJSON(url: string): Promise<GeoJSONData> {
	const response = await fetch(url);
	return response.json();
}
