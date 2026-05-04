import type { Artist } from './artists';

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

const placeholderUSA: Artist[] = Array.from({ length: 10 }, (_, i) => ({
	id: `test-usa-${i + 1}`,
	name: `Test Artist ${i + 1}`,
	country: 'United States of America',
	description: 'Test artist for USA.',
	musicUrl: 'https://soundcloud.com/test',
	soundcloudUrl: ['https://soundcloud.com/lilyeat/breathe'],
	imageUrl: testImages[i % testImages.length]
}));

export const testArtists: Artist[] = [...placeholderUSA, ...generatedUSA, ...generatedRussia];
