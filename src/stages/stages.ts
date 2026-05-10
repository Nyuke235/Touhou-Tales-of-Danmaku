import { SpawnEvent } from '../game/StageScript';
import { Music } from '../systems/MusicManager';
import { BlizzardEvent } from '../systems/BlizzardManager';
import { STAGE_1 } from './stage1';
import { STAGE_2, STAGE_2_BLIZZARD } from './stage2';
import { STAGE_3 } from './stage3';

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
		description: "~ The Fairy's Chilly Playground ~",
	},
	{
		backgroundSrc: 'assets/sprites/backgrounds/stage3_bg.png',
		backgroundSpeed: 25,
		music: Music.STAGE3,
		script: STAGE_3,
		number: 'STAGE 3',
		name: 'Beyond the Sightless Path',
		description: '~ A Rainbow Amidst the Shadows ~',
	},
	// Stages 4-6: scripts to be added
];
