import { Vector3 } from 'three';

export interface Artist {
	id: string;
	name: string;
	country: string;
	lat: number;
	lng: number;
	description: string;
	musicUrl: string;
	soundcloudUrl?: string[];
}

export const artists: Artist[] = [
	{
		id: 'yeat',
		name: 'Yeat',
		country: 'USA',
		lat: 34.05,
		lng: -118.24,
		description: 'Rage music pioneer. Twizzy rich aesthetic.',
		musicUrl: 'https://soundcloud.com/lilyeat',
		soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		]
	},
	{
		id: 'bladee',
		name: 'Bladee',
		country: 'Sweden',
		lat: 59.33,
		lng: 18.07,
		description: 'Drain Gang. Cloud rap transcendence.',
		musicUrl: 'https://soundcloud.com/bladee1000',
			soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		]
	},
	{
		id: 'arca',
		name: 'Arca',
		country: 'Venezuela',
		lat: 10.5,
		lng: -66.92,
		description: 'Experimental electronic. Genre destruction.',
		musicUrl: 'https://soundcloud.com/abortedbygod',
			soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		]
	},
	{
		id: 'death-grips',
		name: 'Death Grips',
		country: 'USA',
		lat: 38.58,
		lng: -121.49,
		description: 'Experimental hip-hop. Pure noise aggression.',
		musicUrl: 'https://soundcloud.com/deathgrips',
			soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		]
	},
	{
		id: 'sophie',
		name: 'SOPHIE',
		country: 'UK',
		lat: 51.51,
		lng: -0.13,
		description: 'Hyperpop architect. Synthetic reality.',
		musicUrl: 'https://soundcloud.com/sophiemsmsmsm',
			soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		]
	},
	{
		id: 'crystal-castles',
		name: 'Crystal Castles',
		country: 'Canada',
		lat: 43.65,
		lng: -79.38,
		description: 'Glitch electronics. Digital punk chaos.',
		musicUrl: 'https://soundcloud.com/crystal-castles',
			soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		]
	},
	{
		id: 'burial',
		name: 'Burial',
		country: 'UK',
		lat: 51.45,
		lng: -0.02,
		description: 'Ghost of UK garage. Nocturnal frequencies.',
		musicUrl: 'https://soundcloud.com/burial-official',
			soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		]
	},
	{
		id: 'gesaffelstein',
		name: 'Gesaffelstein',
		country: 'France',
		lat: 48.86,
		lng: 2.35,
		description: 'Dark techno. Industrial precision.',
		musicUrl: 'https://soundcloud.com/gesaffelstein',
			soundcloudUrl: [
			'https://soundcloud.com/lilyeat/breathe',
			'https://soundcloud.com/lilyeat/psycho-ceo'
		]
	}
];

export function latLngToVector3(lat: number, lng: number, radius: number): Vector3 {
	const phi = (90 - lat) * (Math.PI / 180);
	const theta = (lng + 180) * (Math.PI / 180);

	const x = -(radius * Math.sin(phi) * Math.cos(theta));
	const y = radius * Math.cos(phi);
	const z = radius * Math.sin(phi) * Math.sin(theta);

	return new Vector3(x, y, z);
}
