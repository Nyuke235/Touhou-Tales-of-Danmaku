import { Boss } from '../entities/Boss';
import { Rumia } from '../entities/enemies/bosses/Rumia';
import { RumiaDark } from '../entities/enemies/bosses/RumiaDark';
import { RumiaLantern } from '../entities/enemies/bosses/RumiaLantern';
import { Daiyousei } from '../entities/enemies/bosses/Daiyousei';
import { Cirno } from '../entities/enemies/bosses/Cirno';
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
				name: 'Non-spell 1',
				bossName: 'Dark Rumia',
				phaseIndex: 0,
				stageIndex: 0,
				bossFactory: () => new RumiaDark(BOSS.CENTER_X, -30),
			},
			{
				name: 'Dark Sign 「Night Fog Miasma」',
				bossName: 'Dark Rumia',
				phaseIndex: 1,
				stageIndex: 0,
				bossFactory: () => new RumiaDark(BOSS.CENTER_X, -30),
			},
			{
				name: 'Non-spell 1',
				bossName: 'Rumia',
				phaseIndex: 0,
				stageIndex: 0,
				bossFactory: () => new Rumia(BOSS.CENTER_X, -30),
			},
			{
				name: 'Dark Sign 「Demarcation」',
				bossName: 'Rumia',
				phaseIndex: 1,
				stageIndex: 0,
				bossFactory: () => new Rumia(BOSS.CENTER_X, -30),
			},
			{
				name: 'Non-spell 2',
				bossName: 'Rumia',
				phaseIndex: 2,
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
				name: 'Non-spell 1',
				bossName: 'Daiyousei',
				phaseIndex: 0,
				stageIndex: 1,
				bossFactory: () => new Daiyousei(BOSS.CENTER_X, -30),
			},
			{
				name: "Fairy Sign 「Daiyousei's Vernal Storm」",
				bossName: 'Daiyousei',
				phaseIndex: 1,
				stageIndex: 1,
				bossFactory: () => new Daiyousei(BOSS.CENTER_X, -30),
			},
			{
				name: 'Non-spell 1',
				bossName: 'Cirno',
				phaseIndex: 0,
				stageIndex: 1,
				bossFactory: () => new Cirno(BOSS.CENTER_X, -30),
			},
			{
				name: 'Ice Sign 「No miss!icicle homing missile」',
				bossName: 'Cirno',
				phaseIndex: 1,
				stageIndex: 1,
				bossFactory: () => new Cirno(BOSS.CENTER_X, -30),
			},
			{
				name: 'Non-spell 2',
				bossName: 'Cirno',
				phaseIndex: 2,
				stageIndex: 1,
				bossFactory: () => new Cirno(BOSS.CENTER_X, -30),
			},
			{
				name: 'Freeze Sign 「Perfect Freeze」',
				bossName: 'Cirno',
				phaseIndex: 3,
				stageIndex: 1,
				bossFactory: () => new Cirno(BOSS.CENTER_X, -30),
			},
			{
				name: 'Non-spell 3',
				bossName: 'Cirno',
				phaseIndex: 4,
				stageIndex: 1,
				bossFactory: () => new Cirno(BOSS.CENTER_X, -30),
			},
			{
				name: 'Cold Sign 「Frozen Eternity」',
				bossName: 'Cirno',
				phaseIndex: 5,
				stageIndex: 1,
				bossFactory: () => new Cirno(BOSS.CENTER_X, -30),
			},
		],
	},
	{
		stageLabel: 'Stage 3',
		spellcards: [
			{
				name: 'Non-spell 1',
				bossName: 'Rumia',
				phaseIndex: 0,
				stageIndex: 2,
				bossFactory: () => new RumiaLantern(BOSS.CENTER_X, -30),
			},
			{
				name: 'Lantern Sign 「???」',
				bossName: 'Rumia',
				phaseIndex: 1,
				stageIndex: 2,
				bossFactory: () => new RumiaLantern(BOSS.CENTER_X, -30),
			},
		],
	},
];
