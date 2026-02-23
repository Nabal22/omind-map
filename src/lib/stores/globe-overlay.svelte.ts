let anchorPos = $state<{ x: number; y: number } | null>(null);

export function getAnchorPos(): { x: number; y: number } | null {
	return anchorPos;
}

export function setAnchorPos(v: { x: number; y: number } | null): void {
	anchorPos = v;
}
