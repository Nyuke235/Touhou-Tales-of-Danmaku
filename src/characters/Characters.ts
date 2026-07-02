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
	frameCount: number;
}

export const loadCharacters = async (): Promise<CharacterData[]> =>
	charactersData as CharacterData[];
