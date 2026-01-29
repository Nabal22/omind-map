// Three-globe uses radius 100 by default
export const GLOBE_RADIUS = 100;
export const CAMERA_DISTANCE = 250;
export const ZOOM_DISTANCE = 180;

// Interaction thresholds
export const HOVER_THROTTLE = 50; // ms
export const CLICK_THRESHOLD = 5; // pixels
export const CLICK_TIME_THRESHOLD = 300; // ms

// Colors
export const COLORS = {
	selected: 'rgba(255, 174, 246, 0.8)',
	hovered: 'rgba(255, 174, 246, 0.7)',
	hasArtists: 'rgba(255, 174, 246, 0.5)',
	transparent: 'transparent',
	stroke: 'rgba(255, 174, 246, 0.6)',
	globeBase: '#1a1a2e',
	globeEmissive: '#0a0a15'
} as const;
