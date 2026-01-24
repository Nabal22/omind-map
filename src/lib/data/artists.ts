import { Vector3 } from 'three';

export interface Artist {
	id: string;
	name: string;
	country: string;
	lat: number;
	lng: number;
	description: string;
	musicUrl: string;
	soundcloudEmbedIframe?: string;
}

export const artists: Artist[] = [
	{
		id: 'yeat',
		name: 'Yeat',
		country: 'USA',
		lat: 34.05,
		lng: -118.24,
		description: 'Rage music pioneer. Twizzy rich aesthetic.',
		musicUrl: 'https://open.spotify.com/artist/3qiHUAX7zY4Qnjx8TNUzfx',
		soundcloudEmbedIframe: '<iframe width="100%" height="20" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1748464410&color=%23ffaef6&inverse=false&auto_play=false&show_user=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/lilyeat" title="Yeat" target="_blank" style="color: #cccccc; text-decoration: none;">Yeat</a> · <a href="https://soundcloud.com/lilyeat/psycho-ceo" title="Psycho CEO" target="_blank" style="color: #cccccc; text-decoration: none;">Psycho CEO</a></div>'
	},
	{
		id: 'bladee',
		name: 'Bladee',
		country: 'Sweden',
		lat: 59.33,
		lng: 18.07,
		description: 'Drain Gang. Cloud rap transcendence.',
		musicUrl: 'https://open.spotify.com/artist/2O4GNCFVIzmPkKisgRuEfl'
	},
	{
		id: 'arca',
		name: 'Arca',
		country: 'Venezuela',
		lat: 10.5,
		lng: -66.92,
		description: 'Experimental electronic. Genre destruction.',
		musicUrl: 'https://open.spotify.com/artist/2Ls1qeh5WY2d1Rs0TG2mWC'
	},
	{
		id: 'death-grips',
		name: 'Death Grips',
		country: 'USA',
		lat: 38.58,
		lng: -121.49,
		description: 'Experimental hip-hop. Pure noise aggression.',
		musicUrl: 'https://open.spotify.com/artist/5RADpgYLOuS2ZxDq7ggYYH'
	},
	{
		id: 'sophie',
		name: 'SOPHIE',
		country: 'UK',
		lat: 51.51,
		lng: -0.13,
		description: 'Hyperpop architect. Synthetic reality.',
		musicUrl: 'https://open.spotify.com/artist/5a2w2tgpLwv26BYJf2qYwu'
	},
	{
		id: 'crystal-castles',
		name: 'Crystal Castles',
		country: 'Canada',
		lat: 43.65,
		lng: -79.38,
		description: 'Glitch electronics. Digital punk chaos.',
		musicUrl: 'https://open.spotify.com/artist/6IRouO5mvvfcyxtPDKMYFN'
	},
	{
		id: 'burial',
		name: 'Burial',
		country: 'UK',
		lat: 51.45,
		lng: -0.02,
		description: 'Ghost of UK garage. Nocturnal frequencies.',
		musicUrl: 'https://open.spotify.com/artist/0DnRJAMSbPOeTOHiAaC5fw'
	},
	{
		id: 'gesaffelstein',
		name: 'Gesaffelstein',
		country: 'France',
		lat: 48.86,
		lng: 2.35,
		description: 'Dark techno. Industrial precision.',
		musicUrl: 'https://open.spotify.com/artist/4bL2B6hmLlMWnUEZnorEtG'
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
