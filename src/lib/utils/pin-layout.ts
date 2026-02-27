import {
	PIN_BASE_SPREAD,
	PIN_FIRST_RING_CAPACITY,
	PIN_RING_RADIUS_FACTOR,
	PIN_RING_STAGGER,
	ZOOM_RING_LEVELS
} from '$lib/config';

export interface RingAssignment {
	lat: number;
	lng: number;
	ring: number;
	artistIndex: number;
}

export function computeRingAssignments(
	centroid: { lat: number; lng: number },
	count: number
): RingAssignment[] {
	if (count === 0) return [];

	const lngCorrection =
		1 / Math.max(Math.cos((centroid.lat * Math.PI) / 180), 0.3);
	const assignments: RingAssignment[] = [];
	let placed = 0;
	let ring = 0;

	while (placed < count) {
		const ringRadius = PIN_BASE_SPREAD * (ring + 1) * PIN_RING_RADIUS_FACTOR;
		const capacity =
			ring === 0
				? Math.min(count, PIN_FIRST_RING_CAPACITY)
				: Math.floor(
						((Math.PI * 2 * ringRadius) / PIN_BASE_SPREAD) * 0.7
					);
		const ringCount = Math.min(capacity, count - placed);
		const angleOffset = ring * PIN_RING_STAGGER;

		for (let i = 0; i < ringCount; i++) {
			const angle =
				(i / ringCount) * Math.PI * 2 - Math.PI / 2 + angleOffset;
			assignments.push({
				lat: centroid.lat + Math.sin(angle) * ringRadius,
				lng:
					centroid.lng +
					Math.cos(angle) * ringRadius * lngCorrection,
				ring,
				artistIndex: placed + i
			});
		}

		placed += ringCount;
		ring++;
	}

	return assignments;
}

export function getVisibleRings(cameraDist: number): number {
	for (const level of ZOOM_RING_LEVELS) {
		if (cameraDist <= level.maxDist) return level.rings;
	}
	return 1;
}
