import { redirect } from '@sveltejs/kit';
import { articles } from '$lib/data/articles';

export const prerender = true;

export const entries = () => articles.map((a) => ({ slug: a.slug }));

export const load = ({ params }) => {
	const article = articles.find((a) => a.slug === params.slug);
	if (!article) throw redirect(307, '/articles');
	return { article };
};
