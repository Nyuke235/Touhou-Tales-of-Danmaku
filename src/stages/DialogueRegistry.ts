import { NETWORK } from '../game/Constants';

export type DialogueLine = {
	speaker: 'boss' | 'player';
	portrait: string;
	name: string;
	text: string;
	music?: string;
};

type CharacterDialogue = {
	pre?: DialogueLine[];
	post?: DialogueLine[];
};

type DialogueData = Record<string, Partial<Record<string, CharacterDialogue>>>;

let data: DialogueData = {};

export const DialogueRegistry = {
	async load(): Promise<void> {
		const res = await fetch(`${NETWORK.ASSET_BASE}/assets/json/dialogues.json`);
		data = await res.json();
	},

	getPre(bossId: string, characterId: string): DialogueLine[] {
		return data[bossId]?.[characterId]?.pre ?? [];
	},

	getPost(bossId: string, characterId: string): DialogueLine[] {
		return data[bossId]?.[characterId]?.post ?? [];
	},
};
