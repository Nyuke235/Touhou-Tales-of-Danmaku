import { SpawnEvent } from '../game/StageScript';
import { Music } from '../systems/MusicManager';
import { BlizzardEvent } from '../systems/BlizzardManager';
import { STAGE_1 } from './stage1';
import { STAGE_2, STAGE_2_BLIZZARD } from './stage2';

export interface StageConfig {
	backgroundSrc: string;
	backgroundSpeed: number;
	music: string;
	script: SpawnEvent[];
	blizzard?: BlizzardEvent[];
	number: string;
	name: string;
	description: string;
}

export const STAGES: StageConfig[] = [
	{
		backgroundSrc: 'assets/sprites/backgrounds/stage1_forest.png',
		backgroundSpeed: 20,
		music: Music.STAGE1,
		script: STAGE_1,
		number: 'STAGE 1',
		name: 'Black Ink Staining the Sky',
		description: '~ A Silent Welcome to the World of Night ~',
	},
	{
		backgroundSrc: 'assets/sprites/backgrounds/stage2_lake.png',
		backgroundSpeed: 15,
		music: Music.STAGE2,
		script: STAGE_2,
		blizzard: STAGE_2_BLIZZARD,
		number: 'STAGE 2',
		name: 'Ripples on the Misty Lake',
		description: '~ Where Darkness Meets Still Water ~',
	},
	// Stages 3-6: scripts to be added
];
