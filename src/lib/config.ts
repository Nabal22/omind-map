// Globe geometry
export const GLOBE_RADIUS = 1.0;
export const GLOBE_FILL_RADIUS = 1.01;
export const GLOBE_BORDER_RADIUS = 1.011;
export const PIN_LIFT = 0.06;

// Camera
export const CAMERA_DISTANCE = 2.5;
export const ZOOM_DISTANCE = 1.8;
export const CAMERA_ANIM_DURATION = 0.5;
export const MOBILE_FOV = 80;
export const DESKTOP_FOV = 55;
export const MOBILE_MIN_ZOOM = 1.5;
export const DESKTOP_MIN_ZOOM = 1.4;
export const MOBILE_MAX_ZOOM = 8;
export const DESKTOP_MAX_ZOOM = 4;

// Pin layout
export const PIN_BASE_SPREAD = 7;
export const PIN_FIRST_RING_CAPACITY = 5;
export const PIN_RING_RADIUS_FACTOR = 0.65;
export const PIN_RING_STAGGER = 0.35;

// Zoom-to-reveal thresholds: camera distance → max visible rings
export const ZOOM_RING_LEVELS = [
	{ maxDist: 1.6, rings: 6 },
	{ maxDist: 1.9, rings: 4 },
	{ maxDist: 2.2, rings: 3 },
	{ maxDist: 2.6, rings: 2 },
	{ maxDist: Infinity, rings: 1 }
] as const;

// Touch
export const TAP_THRESHOLD = 10;

// Globe colors
export const COLORS = {
	selected: 0xff0080,
	hoveredWithArtists: 0xff80c0,
	hasArtists: 0xffb3e0,
	defaultCountry: 0x282828,
	background: 0xf0f5fa
} as const;
