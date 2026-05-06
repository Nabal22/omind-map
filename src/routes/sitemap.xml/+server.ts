import { articles } from '$lib/data/articles';
import { artists } from '$lib/data/artists';
import { wtfis } from '$lib/data/wtfis';
import { SITE_URL } from '$lib/config';

export const prerender = true;

export const GET = async () => {
	const staticUrls = ['/', '/articles', '/wtfis', '/artists'];

	const articleUrls = articles.map((a) => ({
		loc: `/articles/${a.slug}`,
		lastmod: a.publishedAt
	}));

	const wtfisUrls = wtfis.map((w) => ({
		loc: `/wtfis/${w.slug}`,
		lastmod: w.publishedAt
	}));

	const artistUrls = artists.map((a) => ({
		loc: `/artists/${a.id}`
	}));

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.w3.org/sitemaps/0.9">
${staticUrls.map((u) => `	<url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}
${articleUrls.map((u) => `	<url><loc>${SITE_URL}${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
${wtfisUrls.map((u) => `	<url><loc>${SITE_URL}${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
${artistUrls.map((u) => `	<url><loc>${SITE_URL}${u.loc}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
