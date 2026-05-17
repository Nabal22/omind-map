import { artists, type Artist } from '$lib/data/artists';
import { articles, type Article } from '$lib/data/articles';
import { wtfis, type WtfisEntry } from '$lib/data/wtfis';

export type SearchKind = 'artist' | 'article' | 'wtfis';

export interface SearchResult {
	kind: SearchKind;
	id: string;
	title: string;
	subtitle: string;
	href: string;
	score: number;
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
		kind: 'artist',
		id: a.id,
		title: a.name,
		subtitle: a.country,
		href: `/artists/${a.id}`,
		score
	};
}

function articleResult(a: Article, score: number): SearchResult {
	return {
		kind: 'article',
		id: a._id,
		title: a.title,
		subtitle: a.category.toUpperCase(),
		href: `/articles/${a.slug}`,
		score
	};
}

function wtfisResult(w: WtfisEntry, score: number): SearchResult {
	return {
		kind: 'wtfis',
		id: w.slug,
		title: `Who The F Is ${w.artist}`,
		subtitle: 'WTFIS',
		href: w.instagramUrl ?? w.tiktokUrl ?? '/wtfis',
		score
	};
}

export function searchAll(query: string): SearchResult[] {
	const q = query.trim();
	if (!q) return [];

	const results: SearchResult[] = [];

	for (const a of artists) {
		const score = bestScore(q, [
			{ value: a.name, weight: 1 },
			{ value: a.country, weight: 0.6 },
			{ value: a.description, weight: 0.4 }
		]);
		if (score > 0) results.push(artistResult(a, score));
	}

	for (const a of articles) {
		const bodyText = a.body.map((b) => b.text).join(' ');
		const score = bestScore(q, [
			{ value: a.title, weight: 1 },
			{ value: a.excerpt, weight: 0.7 },
			{ value: bodyText, weight: 0.3 },
			{ value: a.category, weight: 0.5 }
		]);
		if (score > 0) results.push(articleResult(a, score));
	}

	for (const w of wtfis) {
		const score = bestScore(q, [
			{ value: w.artist, weight: 1 },
			{ value: w.slug, weight: 0.6 }
		]);
		if (score > 0) results.push(wtfisResult(w, score));
	}

	results.sort((a, b) => b.score - a.score);
	return results;
}
