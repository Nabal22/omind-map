export interface Artist {
	id: string;
	name: string;
	country: string;
	description: string;
	musicUrl: string;
	soundcloudUrl?: string[];
	imageUrl: string;
}

const testImages = [
	'/assets/images/artists/perswave%20png.png',
	'/assets/images/artists/afkgoat%20png.png',
	'/assets/images/artists/Zell%20png.png',
	'/assets/images/artists/bic%20png.png',
	'/assets/images/artists/elaiyah%20png.png',
	'/assets/images/artists/turrobaby%20png.png',
	'/assets/images/artists/cero%20png.png',
	'/assets/images/artists/af2008%20stiffy.png',
	'/assets/images/artists/eluney%20benedetti%20png.png',
	'/assets/images/artists/pa2k.png'
];

const generatedUSA: Artist[] = Array.from({ length: 40 }, (_, i) => ({
	id: `gen-usa-${i}`,
	name: `Artist ${i + 1}`,
	country: 'United States of America',
	description: 'Generated test artist.',
	musicUrl: 'https://soundcloud.com/test',
	soundcloudUrl: ['https://soundcloud.com/lilyeat/breathe'],
	imageUrl: testImages[i % testImages.length]
}));

const generatedRussia: Artist[] = Array.from({ length: 9 }, (_, i) => ({
	id: `gen-ru-${i}`,
	name: `RU Artist ${i + 2}`,
	country: 'Russia',
	description: 'Generated test artist.',
	musicUrl: 'https://soundcloud.com/test',
	soundcloudUrl: ['https://soundcloud.com/lilyeat/breathe'],
	imageUrl: testImages[(i + 3) % testImages.length]
}));

export const artists: Artist[] = [
	{
		id: 'yeat',
		name: 'Yeat',
		country: 'United States of America',
		description: 'Rage music pioneer. Twizzy rich aesthetic.',
		musicUrl: 'https://soundcloud.com/lilyeat',
		soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		],
		imageUrl: '/assets/images/artists/perswave%20png.png'
	},
	{
		id: 'yeat2',
		name: 'Yeat2',
		country: 'Russia',
		description: 'Rage music pioneer. Twizzy rich aesthetic.',
		musicUrl: 'https://soundcloud.com/lilyeat',
		soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		],
		imageUrl: '/assets/images/artists/afkgoat%20png.png'
	},
	{
		id: 'bladee',
		name: 'Bladee',
		country: 'Sweden',
		description: 'Drain Gang. Cloud rap transcendence.',
		musicUrl: 'https://soundcloud.com/bladee1000',
		soundcloudUrl: [
			'https://soundcloud.com/bladee1000/3-star-reunite',
			'https://soundcloud.com/bladee1000/the-kingdom'
		],
		imageUrl: '/assets/images/artists/Zell%20png.png'
	},
	{
		id: 'arca',
		name: 'Arca',
		country: 'Venezuela',
		description: 'Experimental electronic. Genre destruction.',
		musicUrl: 'https://soundcloud.com/abortedbygod',
		soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		],
		imageUrl: '/assets/images/artists/eluney%20benedetti%20png.png'
	},
	{
		id: 'death-grips',
		name: 'Death Grips',
		country: 'United States of America',
		description: 'Experimental hip-hop. Pure noise aggression.',
		musicUrl: 'https://soundcloud.com/deathgrips',
		soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		],
		imageUrl: '/assets/images/artists/bic%20png.png'
	},
	{
		id: 'sophie',
		name: 'SOPHIE',
		country: 'United Kingdom',
		description: 'Hyperpop architect. Synthetic reality.',
		musicUrl: 'https://soundcloud.com/sophiemsmsmsm',
		soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		],
		imageUrl: '/assets/images/artists/elaiyah%20png.png'
	},
	{
		id: 'crystal-castles',
		name: 'Crystal Castles',
		country: 'Canada',
		description: 'Glitch electronics. Digital punk chaos.',
		musicUrl: 'https://soundcloud.com/crystal-castles',
		soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		],
		imageUrl: '/assets/images/artists/turrobaby%20png.png'
	},
	{
		id: 'burial',
		name: 'Burial',
		country: 'United Kingdom',
		description: 'Ghost of UK garage. Nocturnal frequencies.',
		musicUrl: 'https://soundcloud.com/burial-official',
		soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		],
		imageUrl: '/assets/images/artists/af2008%20stiffy.png'
	},
	{
		id: 'test-usa-1',
		name: 'Test Artist 1',
		country: 'United States of America',
		description: 'Test artist for USA.',
		musicUrl: 'https://soundcloud.com/test',
		soundcloudUrl: ['https://soundcloud.com/lilyeat/breathe'],
		imageUrl: '/assets/images/artists/perswave%20png.png'
	},
	{
		id: 'test-usa-2',
		name: 'Test Artist 2',
		country: 'United States of America',
		description: 'Test artist for USA.',
		musicUrl: 'https://soundcloud.com/test',
		soundcloudUrl: ['https://soundcloud.com/lilyeat/breathe'],
		imageUrl: '/assets/images/artists/afkgoat%20png.png'
	},
	{
		id: 'test-usa-3',
		name: 'Test Artist 3',
		country: 'United States of America',
		description: 'Test artist for USA.',
		musicUrl: 'https://soundcloud.com/test',
		soundcloudUrl: ['https://soundcloud.com/lilyeat/breathe'],
		imageUrl: '/assets/images/artists/Zell%20png.png'
	},
	{
		id: 'test-usa-4',
		name: 'Test Artist 4',
		country: 'United States of America',
		description: 'Test artist for USA.',
		musicUrl: 'https://soundcloud.com/test',
		soundcloudUrl: ['https://soundcloud.com/lilyeat/breathe'],
		imageUrl: '/assets/images/artists/bic%20png.png'
	},
	{
		id: 'test-usa-5',
		name: 'Test Artist 5',
		country: 'United States of America',
		description: 'Test artist for USA.',
		musicUrl: 'https://soundcloud.com/test',
		soundcloudUrl: ['https://soundcloud.com/lilyeat/breathe'],
		imageUrl: '/assets/images/artists/elaiyah%20png.png'
	},
	{
		id: 'test-usa-6',
		name: 'Test Artist 6',
		country: 'United States of America',
		description: 'Test artist for USA.',
		musicUrl: 'https://soundcloud.com/test',
		soundcloudUrl: ['https://soundcloud.com/lilyeat/breathe'],
		imageUrl: '/assets/images/artists/turrobaby%20png.png'
	},
	{
		id: 'test-usa-7',
		name: 'Test Artist 7',
		country: 'United States of America',
		description: 'Test artist for USA.',
		musicUrl: 'https://soundcloud.com/test',
		soundcloudUrl: ['https://soundcloud.com/lilyeat/breathe'],
		imageUrl: '/assets/images/artists/perswave%20png.png'
	},
	{
		id: 'test-usa-8',
		name: 'Test Artist 8',
		country: 'United States of America',
		description: 'Test artist for USA.',
		musicUrl: 'https://soundcloud.com/test',
		soundcloudUrl: ['https://soundcloud.com/lilyeat/breathe'],
		imageUrl: '/assets/images/artists/afkgoat%20png.png'
	},
	{
		id: 'test-usa-9',
		name: 'Test Artist 9',
		country: 'United States of America',
		description: 'Test artist for USA.',
		musicUrl: 'https://soundcloud.com/test',
		soundcloudUrl: ['https://soundcloud.com/lilyeat/breathe'],
		imageUrl: '/assets/images/artists/Zell%20png.png'
	},
	{
		id: 'test-usa-10',
		name: 'Test Artist 10',
		country: 'United States of America',
		description: 'Test artist for USA.',
		musicUrl: 'https://soundcloud.com/test',
		soundcloudUrl: ['https://soundcloud.com/lilyeat/breathe'],
		imageUrl: '/assets/images/artists/bic%20png.png'
	},
	{
		id: 'gesaffelstein',
		name: 'Gesaffelstein',
		country: 'France',
		description: 'Dark techno. Industrial precision.',
		musicUrl: 'https://soundcloud.com/gesaffelstein',
		soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		],
		imageUrl: '/assets/images/artists/cero%20png.png'
	},
	...generatedUSA,
	...generatedRussia
];
