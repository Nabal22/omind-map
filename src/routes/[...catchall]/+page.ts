import { redirect } from '@sveltejs/kit';

// Lower priority than every named route — only fires for paths SvelteKit can't match.
export const prerender = false;

export const load = () => {
	throw redirect(307, '/');
};
