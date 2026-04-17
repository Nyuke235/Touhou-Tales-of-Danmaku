import { Boss } from '../entities/Boss';
import { Rumia } from '../entities/enemies/bosses/Rumia';
import { RumiaDark } from '../entities/enemies/bosses/RumiaDark';
import { Daiyousei } from '../entities/enemies/bosses/Daiyousei';
import { BOSS } from './Constants';

export interface SpellcardEntry {
	name: string;
	bossName: string;
	phaseIndex: number;
	stageIndex: number;
	bossFactory: () => Boss;
}

export interface StageSpellcardGroup {
	stageLabel: string;
	spellcards: SpellcardEntry[];
}

export const SPELLCARD_REGISTRY: StageSpellcardGroup[] = [
	{
		stageLabel: 'Stage 1',
		spellcards: [
			{
				name: 'Dark Sign 「Night Fog Miasma」',
				bossName: 'Rumia',
				phaseIndex: 1,
				stageIndex: 0,
				bossFactory: () => new RumiaDark(BOSS.CENTER_X, -30),
			},
			{
				name: 'Dark Sign 「Demarcation」',
				bossName: 'Rumia',
				phaseIndex: 1,
				stageIndex: 0,
				bossFactory: () => new Rumia(BOSS.CENTER_X, -30),
			},
			{
				name: 'Night Sign 「Abyss Mandala」',
				bossName: 'Rumia',
				phaseIndex: 3,
				stageIndex: 0,
				bossFactory: () => new Rumia(BOSS.CENTER_X, -30),
			},
		],
	},
	{
		stageLabel: 'Stage 2',
		spellcards: [
			{
				name: "Fairy Sign 「Daiyousei's Vernal Storm」",
				bossName: 'Daiyousei',
				phaseIndex: 1,
				stageIndex: 1,
				bossFactory: () => new Daiyousei(BOSS.CENTER_X, -30),
			},
		],
	},
];
