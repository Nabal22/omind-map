export interface Artist {
	id: string;
	name: string;
	country: string;
	description: string;
	musicUrl: string;
	soundcloudUrl?: string[];
}

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
		]
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
		]
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
		]
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
		]
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
		]
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
		]
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
		]
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
		]
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
		]
	}
];
