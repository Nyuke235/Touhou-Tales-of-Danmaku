import { NETWORK } from '../game/Constants';

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

export const loadCharacters = async (): Promise<CharacterData[]> => {
	const response = await fetch(
		`${NETWORK.ASSET_BASE}/assets/json/characters.json`
	);
	const json = await response.json();
	return json;
};
