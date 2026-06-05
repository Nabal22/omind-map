import type { Continent } from '$lib/utils/continents';

let _open = $state(false);
let _query = $state('');
let _country = $state<string | null>(null);
let _continent = $state<Continent | null>(null);

export function isSearchOpen(): boolean {
	return _open;
}

export function getSearchQuery(): string {
	return _query;
}

export function getSearchCountry(): string | null {
	return _country;
}

export function getSearchContinent(): Continent | null {
	return _continent;
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

export function setSearchCountry(value: string | null): void {
	_country = value;
}

export function setSearchContinent(value: Continent | null): void {
	_continent = value;
	if (value) _country = null;
}

export function clearSearchFilters(): void {
	_country = null;
	_continent = null;
}

export function resetSearch(): void {
	_open = false;
	_query = '';
	_country = null;
	_continent = null;
}
