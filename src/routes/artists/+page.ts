import { artists } from '$lib/data/artists';

export const prerender = true;

export const load = () => ({ artists });
