let _open = $state(false);
let _query = $state('');

export function isSearchOpen(): boolean {
	return _open;
}

export function getSearchQuery(): string {
	return _query;
}

export function openSearch(): void {
	_open = true;
}

export function closeSearch(): void {
	_open = false;
}

export function setSearchQuery(value: string): void {
	_query = value;
}

export function resetSearch(): void {
	_open = false;
	_query = '';
}
