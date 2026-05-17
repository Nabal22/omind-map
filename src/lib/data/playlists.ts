export type PlaylistPlatform = 'spotify' | 'apple-music' | 'youtube' | 'soundcloud' | 'deezer';

export type PlaylistType = 'playlist' | 'radio';

export interface PlaylistLink {
	platform: PlaylistPlatform;
	url: string;
}

export interface Playlist {
	slug: string;
	type: PlaylistType;
	title: string;
	description?: string;
	publishedAt?: string;
	thumbnail: string;
	links: PlaylistLink[];
}

export const playlists: Playlist[] = [
	{
		slug: 'top-100-2025',
		type: 'playlist',
		title: "Omind's 100 favourite songs of 2025",
		description: 'A curated rundown of the year — 100 tracks that defined Omind in 2025.',
		thumbnail:
			'https://ugc.production.linktr.ee/434dc616-c89c-49b6-8655-08a6500bf1ae_ab67706c0000da84c125a06b9b3c5152431f613d.jpeg',
		links: [
			{
				platform: 'spotify',
				url: 'https://open.spotify.com/playlist/6IUlMomnyr1MNrqbUFk9Wb?si=c44a8d83d9f04135'
			},
			{
				platform: 'apple-music',
				url: 'https://music.apple.com/fr/playlist/ominds-100-favourite-songs-of-2025/pl.u-76oNlPytvEjbZMK'
			},
			{
				platform: 'youtube',
				url: 'https://youtube.com/playlist?list=PLEwJ0kJEOXq32annwWAGN-HUx6GR5kslU&si=j05XMerpYIfFhcKA'
			},
			{
				platform: 'soundcloud',
				url: 'https://soundcloud.com/omind-980831217/sets/ominds-100-favorite-songs-of?si=dbb744e629b54c938aa6d52aa67f3fbe'
			},
			{
				platform: 'deezer',
				url: 'https://link.deezer.com/s/31ZgRxBbnAoagZ74hzSQW'
			}
		]
	},
	{
		slug: 'omind-over-the-world',
		type: 'playlist',
		title: 'Omind Over The World',
		description: 'Monthly worldwide rap and beats selection — globe-trotting rap, beats, and more.',
		thumbnail:
			'https://ugc.production.linktr.ee/d2d7ed15-d52b-4d5e-8414-ca1d4c2f52c7_Minia-Cover.png',
		links: [
			{
				platform: 'spotify',
				url: 'https://open.spotify.com/playlist/0AlvgjONeyrCNNxSIQhY23?si=0e01a2ddbc054378'
			},
			{
				platform: 'youtube',
				url: 'https://youtube.com/playlist?list=PLEwJ0kJEOXq1qoo65DvNpjIrShReZ8Lm4&si=3QDaUKKeoDmVGx9R'
			}
		]
	},
	{
		slug: 'omind-radio-004-swissknife',
		type: 'radio',
		title: 'Omind Radio 004 with Swissknife',
		publishedAt: '2025-06-20',
		thumbnail: 'https://i1.sndcdn.com/artworks-M16fEwO6cSdUlynS-ufdtAQ-t3000x3000.png',
		links: [
			{
				platform: 'soundcloud',
				url: 'https://soundcloud.com/omind-980831217/omind-radio-004-with-swissknife'
			}
		]
	},
	{
		slug: 'omind-radio-003-yerandy',
		type: 'radio',
		title: 'Omind Radio 003 with Yerandy',
		publishedAt: '2025-05-19',
		thumbnail: 'https://i1.sndcdn.com/artworks-j53dzUvYvtBNKWzi-N8zVcg-t3000x3000.png',
		links: [
			{
				platform: 'soundcloud',
				url: 'https://soundcloud.com/omind-980831217/omind-radio-003-with-yerandy'
			}
		]
	},
	{
		slug: 'omind-radio-002-kieran-dotwav',
		type: 'radio',
		title: 'Omind Radio 002 with Kieran Dotwav',
		publishedAt: '2025-04-20',
		thumbnail: 'https://i1.sndcdn.com/artworks-SDu57byBfAWhhCmj-XrZmHQ-t3000x3000.png',
		links: [
			{
				platform: 'soundcloud',
				url: 'https://soundcloud.com/omind-980831217/omind-radio-002-with-kieran-dotwav'
			}
		]
	},
	{
		slug: 'omind-radio-001-le-kla',
		type: 'radio',
		title: 'Omind Radio 001 with Le Kla',
		publishedAt: '2025-04-04',
		thumbnail: 'https://i1.sndcdn.com/artworks-pBAoAWo6cwbzRU1c-uTapfw-t3000x3000.png',
		links: [
			{
				platform: 'soundcloud',
				url: 'https://soundcloud.com/omind-980831217/omind-radio-001-lekla'
			}
		]
	},
	{
		slug: 'special-mix-nabal',
		type: 'radio',
		title: 'Special Mix — 15 rappers to watch in 2025: Nabal',
		publishedAt: '2025-03-10',
		thumbnail: 'https://i1.sndcdn.com/artworks-iaI8Rfunuw389SDv-hBVSJw-t3000x3000.png',
		links: [
			{
				platform: 'soundcloud',
				url: 'https://soundcloud.com/omind-980831217/special-mix-nabal'
			}
		]
	}
];

const PLATFORM_LABELS: Record<PlaylistPlatform, string> = {
	spotify: 'Spotify',
	'apple-music': 'Apple Music',
	youtube: 'YouTube',
	soundcloud: 'SoundCloud',
	deezer: 'Deezer'
};

export function platformLabel(p: PlaylistPlatform): string {
	return PLATFORM_LABELS[p];
}
