export interface ArticleBlock {
	_type: 'paragraph' | 'heading' | 'quote';
	text: string;
}

export interface Article {
	_id: string;
	slug: string;
	title: string;
	author: string;
	publishedAt: string;
	category: 'feature' | 'interview' | 'review' | 'news';
	coverImageUrl: string;
	excerpt: string;
	body: ArticleBlock[];
	relatedArtistId: string;
}

export const articles: Article[] = [
	{
		_id: 'article-001',
		slug: 'playboi-carti-whole-lotta-red',
		title: 'Playboi Carti and the Architecture of Whole Lotta Red',
		author: 'omind',
		publishedAt: '2025-12-15',
		category: 'feature',
		coverImageUrl: 'music.jpeg',
		excerpt:
			'How Carti dismantled rap conventions and rebuilt them as something alien, aggressive, and entirely his own.',
		body: [
			{
				_type: 'paragraph',
				text: 'When Whole Lotta Red dropped on Christmas Day 2020, the reaction was immediate and polarizing. Half the internet called it a masterpiece. The other half called it unlistenable. Five years later, the verdict is clear — Carti rewired what rap could sound like.'
			},
			{
				_type: 'paragraph',
				text: 'The album\'s production, largely helmed by F1lthy and Art Dealer, operates in extremes. Tracks like "Rockstar Made" and "Stop Breathing" push distortion and aggression to their logical endpoint, while "ILoveUIHateU" and "Sky" reveal a melodic vulnerability buried under layers of vocal processing.'
			},
			{
				_type: 'quote',
				text: "Carti doesn't make songs. He makes frequencies that happen to have words in them."
			},
			{
				_type: 'paragraph',
				text: 'What makes WLR significant beyond its sound is its influence. The punk-rap aesthetic Carti championed — the leather, the aggression, the deliberate imperfection — became the dominant visual and sonic language of underground rap in the years that followed.'
			},
			{
				_type: 'paragraph',
				text: "The Opium label, home to Ken Carson, Destroy Lonely, and Homixide Gang, extended this blueprint into an entire ecosystem. Each artist took a different fragment of Carti's approach and built their own world around it."
			},
			{
				_type: 'paragraph',
				text: "With MUSIC still on the horizon, the question isn't whether Carti can top WLR. It's whether the culture he created has already moved past the need for another album. The architecture is built. The building stands on its own."
			}
		],
		relatedArtistId: 'yeat'
	},
	{
		_id: 'article-002',
		slug: 'yeat-interview-twizzy-rich',
		title: 'Yeat: The Twizzy Rich Interview',
		author: 'omind',
		publishedAt: '2026-01-22',
		category: 'interview',
		coverImageUrl: '',
		excerpt:
			"We sat down with Yeat to talk rage music, creative isolation, and why he doesn't listen to his own albums.",
		body: [
			{
				_type: 'heading',
				text: 'On the origins of rage'
			},
			{
				_type: 'paragraph',
				text: "omind: You've become synonymous with rage music. But when you started, did you have a name for what you were doing?"
			},
			{
				_type: 'paragraph',
				text: "Yeat: Nah, not really. I was just making what felt right. The beats Sep and Trgc were sending me had this energy that was different from everything else. It wasn't trap, it wasn't punk rap. It was its own thing. People needed a word for it so they called it rage."
			},
			{
				_type: 'heading',
				text: 'On creative process'
			},
			{
				_type: 'paragraph',
				text: 'omind: Your output is insane. 2093, AftërLyfe, 2 Alivë — all within a short window. How do you maintain that pace?'
			},
			{
				_type: 'paragraph',
				text: "Yeat: I don't think about it as pace. When I'm in the studio, I'm just going. Sometimes I'll do five, six songs in a session. Not all of them make it but the ones that do, those came out in like twenty minutes. The best stuff is always fast."
			},
			{
				_type: 'heading',
				text: 'On not listening back'
			},
			{
				_type: 'paragraph',
				text: "omind: You've said before that you don't listen to your own albums after they drop. Is that still true?"
			},
			{
				_type: 'paragraph',
				text: "Yeat: Yeah. Once it's out, it's out. I'm already on the next thing. If I sit there listening to old stuff I'm gonna start second-guessing everything. I'd rather just keep moving forward. The fans can listen back. That's their job."
			},
			{
				_type: 'heading',
				text: "On what's next"
			},
			{
				_type: 'paragraph',
				text: "omind: Anything you can tell us about what's coming?"
			},
			{
				_type: 'paragraph',
				text: "Yeat: It's different. That's all I'll say. People think they know what I'm gonna do and then I do something else. That's the whole point."
			}
		],
		relatedArtistId: 'yeat'
	}
];
