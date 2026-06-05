export type Continent =
	| 'Africa'
	| 'Asia'
	| 'Europe'
	| 'North America'
	| 'South America'
	| 'Oceania'
	| 'Antarctica';

const COUNTRY_TO_CONTINENT: Record<string, Continent> = {
	// North America
	'United States of America': 'North America',
	'United States': 'North America',
	USA: 'North America',
	Canada: 'North America',
	Mexico: 'North America',
	// South America
	Brazil: 'South America',
	Argentina: 'South America',
	Chile: 'South America',
	Colombia: 'South America',
	Venezuela: 'South America',
	Peru: 'South America',
	Uruguay: 'South America',
	Ecuador: 'South America',
	Bolivia: 'South America',
	Paraguay: 'South America',
	// Europe
	France: 'Europe',
	'United Kingdom': 'Europe',
	UK: 'Europe',
	Germany: 'Europe',
	Spain: 'Europe',
	Italy: 'Europe',
	Sweden: 'Europe',
	Norway: 'Europe',
	Denmark: 'Europe',
	Finland: 'Europe',
	Netherlands: 'Europe',
	Belgium: 'Europe',
	Switzerland: 'Europe',
	Austria: 'Europe',
	Poland: 'Europe',
	Portugal: 'Europe',
	Ireland: 'Europe',
	Greece: 'Europe',
	'Czech Republic': 'Europe',
	Hungary: 'Europe',
	Romania: 'Europe',
	Russia: 'Europe',
	Ukraine: 'Europe',
	// Africa
	Nigeria: 'Africa',
	'South Africa': 'Africa',
	Egypt: 'Africa',
	Morocco: 'Africa',
	Kenya: 'Africa',
	Ghana: 'Africa',
	Ethiopia: 'Africa',
	Senegal: 'Africa',
	Tanzania: 'Africa',
	Algeria: 'Africa',
	Tunisia: 'Africa',
	// Asia
	Japan: 'Asia',
	China: 'Asia',
	'South Korea': 'Asia',
	India: 'Asia',
	Thailand: 'Asia',
	Vietnam: 'Asia',
	Indonesia: 'Asia',
	Philippines: 'Asia',
	Malaysia: 'Asia',
	Singapore: 'Asia',
	Pakistan: 'Asia',
	Bangladesh: 'Asia',
	Turkey: 'Asia',
	Israel: 'Asia',
	'Saudi Arabia': 'Asia',
	'United Arab Emirates': 'Asia',
	// Oceania
	Australia: 'Oceania',
	'New Zealand': 'Oceania'
};

export function getContinent(country: string): Continent | null {
	return COUNTRY_TO_CONTINENT[country] ?? null;
}

export const CONTINENTS: Continent[] = [
	'North America',
	'South America',
	'Europe',
	'Africa',
	'Asia',
	'Oceania'
];
