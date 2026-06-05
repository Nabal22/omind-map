import { artists, type Artist } from '$lib/data/artists';
import { getContinent, type Continent } from '$lib/utils/continents';

export interface SearchResult {
	id: string;
	title: string;
	subtitle: string;
	href: string;
	score: number;
}

export interface SearchFilters {
	country?: string | null;
	continent?: Continent | null;
}

function scoreMatch(haystack: string, needle: string): number {
	if (!haystack) return 0;
	const h = haystack.toLowerCase();
	const n = needle.toLowerCase();
	if (h === n) return 100;
	if (h.startsWith(n)) return 60;
	if (h.includes(n)) return 30;
	return 0;
}

function bestScore(needle: string, fields: { value: string; weight: number }[]): number {
	let best = 0;
	for (const { value, weight } of fields) {
		const s = scoreMatch(value, needle) * weight;
		if (s > best) best = s;
	}
	return best;
}

function artistResult(a: Artist, score: number): SearchResult {
	return {
		id: a.id,
		title: a.name,
		subtitle: a.country,
		href: `/artists/${a.id}`,
		score
	};
}

function applyFilters(a: Artist, filters: SearchFilters): boolean {
	if (filters.country && a.country !== filters.country) return false;
	if (filters.continent && getContinent(a.country) !== filters.continent) return false;
	return true;
}

export function searchArtists(query: string, filters: SearchFilters = {}): SearchResult[] {
	const q = query.trim();
	const filtered = artists.filter((a) => applyFilters(a, filters));

	if (!q) {
		return filtered.map((a) => artistResult(a, 1)).sort((x, y) => x.title.localeCompare(y.title));
	}

	const results: SearchResult[] = [];
	for (const a of filtered) {
		const score = bestScore(q, [
			{ value: a.name, weight: 1 },
			{ value: a.country, weight: 0.6 },
			{ value: a.description, weight: 0.4 }
		]);
		if (score > 0) results.push(artistResult(a, score));
	}
	results.sort((x, y) => y.score - x.score);
	return results;
}

export function listCountries(): string[] {
	const set = new Set<string>();
	for (const a of artists) set.add(a.country);
	return Array.from(set).sort();
}
