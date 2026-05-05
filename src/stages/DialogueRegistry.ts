import rawData from './dialogues.json';

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

const data = rawData as unknown as DialogueData;

export const DialogueRegistry = {
	async load(): Promise<void> {},

	getPre(bossId: string, characterId: string): DialogueLine[] {
		return data[bossId]?.[characterId]?.pre ?? [];
	},

	getPost(bossId: string, characterId: string): DialogueLine[] {
		return data[bossId]?.[characterId]?.post ?? [];
	},
};
