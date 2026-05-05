import charactersData from './characters.json';

export interface CharacterData {
	id: string;
	name: string;
	title: string;
	speed: string;
	shot: string;
	spellcard: string;
	spellcardFull: string;
	sprite: string[];
}

export const loadCharacters = async (): Promise<CharacterData[]> =>
	charactersData as CharacterData[];
