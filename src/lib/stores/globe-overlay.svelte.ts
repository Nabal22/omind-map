let anchorPos = $state<{ x: number; y: number } | null>(null);

export function getAnchorPos(): { x: number; y: number } | null {
	return anchorPos;
}

export function setAnchorPos(v: { x: number; y: number } | null): void {
	anchorPos = v;
}

export interface PinScreenPos {
	x: number;
	y: number;
	visible: boolean;
	scale: number;
}

let pinScreenPositions = $state<PinScreenPos[]>([]);

export function getPinScreenPositions(): PinScreenPos[] {
	return pinScreenPositions;
}

export function setPinScreenPositions(v: PinScreenPos[]): void {
	pinScreenPositions = v;
}

let globeLoaded = $state(false);

export function isGlobeLoaded(): boolean {
	return globeLoaded;
}

export function setGlobeLoaded(): void {
	globeLoaded = true;
}
