import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';
import earcut from 'earcut';
import type { FeatureCollection, Geometry, Position } from 'geojson';

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
 * Flatten polygon coordinates for earcut triangulation
 */
function flattenPolygon(rings: Position[][]): { vertices: number[]; holes: number[] } {
	const vertices: number[] = [];
	const holes: number[] = [];

	for (let i = 0; i < rings.length; i++) {
		const ring = rings[i];
		if (i > 0) {
			holes.push(vertices.length / 2);
		}
		for (const coord of ring) {
			vertices.push(coord[0], coord[1]); // lng, lat
		}
	}

	return { vertices, holes };
}

/**
 * Subdivide a triangle on a sphere for smoother curvature
 */
function subdivideTriangle(
	v1: Vector3,
	v2: Vector3,
	v3: Vector3,
	radius: number,
	depth: number
): Vector3[][] {
	if (depth === 0) {
		return [[v1, v2, v3]];
	}

	// Midpoints, normalized to sphere surface
	const mid12 = new Vector3().addVectors(v1, v2).normalize().multiplyScalar(radius);
	const mid23 = new Vector3().addVectors(v2, v3).normalize().multiplyScalar(radius);
	const mid31 = new Vector3().addVectors(v3, v1).normalize().multiplyScalar(radius);

	return [
		...subdivideTriangle(v1, mid12, mid31, radius, depth - 1),
		...subdivideTriangle(mid12, v2, mid23, radius, depth - 1),
		...subdivideTriangle(mid31, mid23, v3, radius, depth - 1),
		...subdivideTriangle(mid12, mid23, mid31, radius, depth - 1)
	];
}

/**
 * Triangulate a polygon and project onto a sphere
 */
function triangulatePolygon(
	rings: Position[][],
	radius: number,
	subdivisions: number = 1
): { positions: number[]; normals: number[] } {
	const { vertices, holes } = flattenPolygon(rings);
	const indices = earcut(vertices, holes, 2);

	const positions: number[] = [];
	const normals: number[] = [];

	for (let i = 0; i < indices.length; i += 3) {
		const i1 = indices[i];
		const i2 = indices[i + 1];
		const i3 = indices[i + 2];

		const lng1 = vertices[i1 * 2];
		const lat1 = vertices[i1 * 2 + 1];
		const lng2 = vertices[i2 * 2];
		const lat2 = vertices[i2 * 2 + 1];
		const lng3 = vertices[i3 * 2];
		const lat3 = vertices[i3 * 2 + 1];

		const v1 = latLngToVector3(lat1, lng1, radius);
		const v2 = latLngToVector3(lat2, lng2, radius);
		const v3 = latLngToVector3(lat3, lng3, radius);

		// Subdivide for smoother sphere projection
		const triangles = subdivideTriangle(v1, v2, v3, radius, subdivisions);

		for (const [tv1, tv2, tv3] of triangles) {
			// Positions
			positions.push(tv1.x, tv1.y, tv1.z);
			positions.push(tv2.x, tv2.y, tv2.z);
			positions.push(tv3.x, tv3.y, tv3.z);

			// Normals (pointing outward from sphere center)
			const n1 = tv1.clone().normalize();
			const n2 = tv2.clone().normalize();
			const n3 = tv3.clone().normalize();
			normals.push(n1.x, n1.y, n1.z);
			normals.push(n2.x, n2.y, n2.z);
			normals.push(n3.x, n3.y, n3.z);
		}
	}

	return { positions, normals };
}

/**
 * Process a GeoJSON geometry into triangulated mesh data
 */
function processGeometry(
	geometry: Geometry,
	radius: number,
	subdivisions: number
): { positions: number[]; normals: number[] } {
	const positions: number[] = [];
	const normals: number[] = [];

	if (geometry.type === 'Polygon') {
		const result = triangulatePolygon(geometry.coordinates, radius, subdivisions);
		positions.push(...result.positions);
		normals.push(...result.normals);
	} else if (geometry.type === 'MultiPolygon') {
		for (const polygon of geometry.coordinates) {
			const result = triangulatePolygon(polygon, radius, subdivisions);
			positions.push(...result.positions);
			normals.push(...result.normals);
		}
	}

	return { positions, normals };
}

/**
 * Build Three.js BufferGeometry meshes from GeoJSON FeatureCollection
 */
export function buildCountryMeshGeometry(
	geojson: FeatureCollection<Geometry>,
	radius = 2.01,
	subdivisions = 1
): BufferGeometry {
	const allPositions: number[] = [];
	const allNormals: number[] = [];

	for (const feature of geojson.features) {
		if (!feature.geometry) continue;

		const { positions, normals } = processGeometry(feature.geometry, radius, subdivisions);
		allPositions.push(...positions);
		allNormals.push(...normals);
	}

	const geometry = new BufferGeometry();
	geometry.setAttribute('position', new Float32BufferAttribute(allPositions, 3));
	geometry.setAttribute('normal', new Float32BufferAttribute(allNormals, 3));

	return geometry;
}

/**
 * Build country border outlines as line geometry
 */
export function buildCountryOutlineGeometry(
	geojson: FeatureCollection<Geometry>,
	radius = 2.02
): BufferGeometry {
	const segments: number[] = [];

	function processRing(ring: Position[]): void {
		if (ring.length < 2) return;

		const verts = ring.map((coord) => latLngToVector3(coord[1], coord[0], radius));

		for (let i = 0; i < verts.length - 1; i++) {
			const a = verts[i];
			const b = verts[i + 1];
			segments.push(a.x, a.y, a.z, b.x, b.y, b.z);
		}
	}

	function processGeometryOutline(geometry: Geometry): void {
		if (geometry.type === 'Polygon') {
			for (const ring of geometry.coordinates) {
				processRing(ring);
			}
		} else if (geometry.type === 'MultiPolygon') {
			for (const polygon of geometry.coordinates) {
				for (const ring of polygon) {
					processRing(ring);
				}
			}
		}
	}

	for (const feature of geojson.features) {
		if (!feature.geometry) continue;
		processGeometryOutline(feature.geometry);
	}

	const geo = new BufferGeometry();
	geo.setAttribute('position', new Float32BufferAttribute(segments, 3));
	return geo;
}

// Keep backward compatibility
export const buildCountryGeometry = buildCountryOutlineGeometry;
