export interface Track {
	title: string;
	artist: string;
	duration: string;
	soundcloudUrl?: string;
}

export interface StreamingLinks {
	spotify?: string;
	appleMusic?: string;
	soundcloud?: string;
}

export interface Playlist {
	id: string;
	slug: string;
	title: string;
	description: string;
	curator: string;
	createdAt: string;
	tags: string[];
	tracks: Track[];
	streamingLinks?: StreamingLinks;
}

export const playlists: Playlist[] = [
	{
		id: 'playlist-001',
		slug: 'rage-season-vol-1',
		title: 'Rage Season Vol. 1',
		description:
			'The distorted, aggressive end of rap — where punk energy meets 808s and vocal processing pushed past the limit.',
		curator: 'omind',
		createdAt: '2026-01-10',
		tags: ['rage', 'opium', 'punk rap'],
		streamingLinks: {
			spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
			appleMusic: 'https://music.apple.com/us/playlist/rage-hits/pl.u-leyl0jgf4XoYaJ',
		},
		tracks: [
			{ title: 'Rockstar Made', artist: 'Playboi Carti', duration: '2:14' },
			{ title: 'Talk', artist: 'Yeat', duration: '2:31' },
			{ title: 'I Want It', artist: 'Ken Carson', duration: '1:58' },
			{ title: 'I Wanna Die In LA', artist: 'Destroy Lonely', duration: '2:47' },
			{ title: 'Stop Breathing', artist: 'Playboi Carti', duration: '3:02' },
			{ title: 'Luh World', artist: 'Yeat', duration: '2:19' },
			{ title: 'Paranoid', artist: 'Ken Carson', duration: '2:08' },
			{ title: 'Buss It', artist: 'Homixide Gang', duration: '1:55' },
			{ title: '2093', artist: 'Yeat', duration: '2:44' },
			{ title: 'Overseas', artist: 'Destroy Lonely', duration: '3:11' },
		]
	},
	{
		id: 'playlist-002',
		slug: 'nordic-cold',
		title: 'Nordic Cold',
		description:
			'Sad rap and art pop from Scandinavia — Drain Gang\u2019s icy aesthetic, ambient textures, and melodic dissonance.',
		curator: 'omind',
		createdAt: '2026-01-28',
		tags: ['drain gang', 'sweden', 'ambient rap'],
		streamingLinks: {
			spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX1rVvRgjX59F',
			soundcloud: 'https://soundcloud.com/bladee/sets',
		},
		tracks: [
			{ title: 'Icedancer', artist: 'Bladee', duration: '2:53' },
			{ title: 'Waster', artist: 'Yung Lean', duration: '4:01' },
			{ title: 'Percolator', artist: 'Ecco2k', duration: '3:17' },
			{ title: 'Spiderr', artist: 'Bladee', duration: '3:44' },
			{ title: 'Ginseng Strip 2002', artist: 'Yung Lean', duration: '3:28' },
			{ title: 'Calcium', artist: 'Ecco2k', duration: '2:59' },
			{ title: 'Numb', artist: 'Bladee', duration: '3:05' },
			{ title: 'Agony', artist: 'Yung Lean', duration: '3:52' },
		]
	},
	{
		id: 'playlist-003',
		slug: 'electronic-avant',
		title: 'Electronic Avant',
		description:
			'Where experimental electronic music bleeds into rap — industrial beats, deconstructed club, and noise as texture.',
		curator: 'omind',
		createdAt: '2026-02-05',
		tags: ['experimental', 'industrial', 'club'],
		streamingLinks: {
			spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX6ujZpAN0v6r',
			appleMusic: 'https://music.apple.com/us/playlist/experimental-club/pl.u-leyl0WTf4XoYaJ',
			soundcloud: 'https://soundcloud.com/xcxarcaxcx/sets',
		},
		tracks: [
			{ title: 'Nonbinary', artist: 'Arca', duration: '4:12' },
			{ title: 'Hot Hot Hot!!!', artist: 'SOPHIE', duration: '3:41' },
			{ title: 'Guillotine', artist: 'Death Grips', duration: '3:07' },
			{ title: 'Haunting', artist: 'Crystal Castles', duration: '3:28' },
			{ title: 'Untitled 7', artist: 'Burial', duration: '8:14' },
			{ title: 'Ponyboy', artist: 'SOPHIE', duration: '3:55' },
			{ title: 'Ratchet', artist: 'Arca', duration: '4:02' },
			{ title: 'Hacker', artist: 'Death Grips', duration: '3:33' },
			{ title: 'Gesaffelstein - Pursuit', artist: 'Gesaffelstein', duration: '5:17' },
			{ title: 'Untitled 3', artist: 'Burial', duration: '9:22' },
		]
	},
	{
		id: 'playlist-004',
		slug: 'uk-current',
		title: 'UK Current',
		description:
			'The continuum from grime to drill — energy, precision, and the London sound in its various modern forms.',
		curator: 'omind',
		createdAt: '2026-02-14',
		tags: ['uk', 'grime', 'drill'],
		streamingLinks: {
			spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX1gPRCPAhi8E',
			appleMusic: 'https://music.apple.com/gb/playlist/uk-drill/pl.u-leyl0abf4XoYaJ',
		},
		tracks: [
			{ title: 'Shutdown', artist: 'Skepta', duration: '3:44' },
			{ title: 'Charge It', artist: 'Central Cee', duration: '2:58' },
			{ title: 'Lesley', artist: 'Dave', duration: '4:31' },
			{ title: 'That\u2019s Not Me', artist: 'Skepta', duration: '3:02' },
			{ title: 'Loading', artist: 'Central Cee', duration: '2:41' },
			{ title: 'Survivor\'s Guilt', artist: 'Dave', duration: '5:18' },
			{ title: 'Nasty', artist: 'Skepta', duration: '3:19' },
			{ title: '6 for 6', artist: 'Central Cee', duration: '2:33' },
		]
	}
];
