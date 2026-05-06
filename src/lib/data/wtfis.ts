export interface WtfisEntry {
	slug: string;
	artist: string;
	publishedAt: string;
	thumbnail: string;
	instagramUrl?: string;
	tiktokUrl?: string;
}

// MVP: thumbnails point to logo placeholder. Drop real files at
// static/wtfis/<slug>.jpg and swap each `thumbnail` path when ready.
// When self-hosting clips later, add `videoUrl` field + <video> player.
const PLACEHOLDER = '/assets/images/logo-0mind-removed-bg.png';

export const wtfis: WtfisEntry[] = [
	{
		slug: 'yeat',
		artist: 'Yeat',
		publishedAt: '2026-04-12',
		thumbnail: PLACEHOLDER,
		instagramUrl: 'https://www.instagram.com/reel/placeholder-yeat/',
		tiktokUrl: 'https://www.tiktok.com/@omind/video/placeholder-yeat'
	},
	{
		slug: 'bladee',
		artist: 'Bladee',
		publishedAt: '2026-03-28',
		thumbnail: PLACEHOLDER,
		instagramUrl: 'https://www.instagram.com/reel/placeholder-bladee/',
		tiktokUrl: 'https://www.tiktok.com/@omind/video/placeholder-bladee'
	},
	{
		slug: 'arca',
		artist: 'Arca',
		publishedAt: '2026-03-14',
		thumbnail: PLACEHOLDER,
		instagramUrl: 'https://www.instagram.com/reel/placeholder-arca/'
	},
	{
		slug: 'sophie',
		artist: 'SOPHIE',
		publishedAt: '2026-02-22',
		thumbnail: PLACEHOLDER,
		tiktokUrl: 'https://www.tiktok.com/@omind/video/placeholder-sophie'
	},
	{
		slug: 'burial',
		artist: 'Burial',
		publishedAt: '2026-02-08',
		thumbnail: PLACEHOLDER,
		instagramUrl: 'https://www.instagram.com/reel/placeholder-burial/',
		tiktokUrl: 'https://www.tiktok.com/@omind/video/placeholder-burial'
	},
	{
		slug: 'death-grips',
		artist: 'Death Grips',
		publishedAt: '2026-01-25',
		thumbnail: PLACEHOLDER,
		instagramUrl: 'https://www.instagram.com/reel/placeholder-death-grips/'
	}
];
