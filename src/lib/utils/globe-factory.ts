import ThreeGlobe from 'three-globe';
import * as THREE from 'three';
import { COLORS } from './globe-constants';
import type { GeoFeature } from './geo-utils';

export type PolygonColorFn = (d: GeoFeature) => string;

export interface GlobeConfig {
	polygonColorFn: PolygonColorFn;
}

/**
 * Create and configure a ThreeGlobe instance
 */
export function createGlobe(config: GlobeConfig): ThreeGlobe {
	const globe = new ThreeGlobe({ animateIn: false }) as any;

	globe
		.globeImageUrl('')
		.showAtmosphere(false)
		.showGlobe(true)
		.polygonCapColor(config.polygonColorFn)
		.polygonSideColor(() => COLORS.transparent)
		.polygonStrokeColor(() => COLORS.stroke)
		.polygonAltitude(0.01);

	// Configure globe material
	const globeMaterial = globe.globeMaterial() as THREE.MeshPhongMaterial;
	globeMaterial.color = new THREE.Color(COLORS.globeBase);
	globeMaterial.emissive = new THREE.Color(COLORS.globeEmissive);
	globeMaterial.shininess = 0.7;

	return globe;
}

/**
 * Load polygons data into the globe
 */
export function setGlobePolygons(globe: ThreeGlobe, features: GeoFeature[]): void {
	(globe as any).polygonsData(features);
}

/**
 * Update the polygon color function
 */
export function updatePolygonColors(globe: ThreeGlobe, colorFn: PolygonColorFn): void {
	(globe as any).polygonCapColor(colorFn);
}
