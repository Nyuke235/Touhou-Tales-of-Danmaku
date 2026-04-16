export const Difficulty = {
	EASY: 'EASY',
	NORMAL: 'NORMAL',
	HARD: 'HARD',
	LUNATIC: 'LUNATIC',
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const Character = {
	REIMU: 'reimu',
	MARISA: 'marisa',
} as const;

export type Character = (typeof Character)[keyof typeof Character];

import { PLAYER } from './Constants';

export const GameState = {
	difficulty: Difficulty.NORMAL as Difficulty,
	character: Character.REIMU as Character,
	character2: Character.MARISA as Character,
	characterColor: 'default' as string,
	character2Color: 'default' as string,
	power: 0.0,
	maxPower: PLAYER.MAX_POWER,
	graze: 0,
	pointItems: 0,
	highScore: 0,
	date: Date.now(),
	practiceMode: false,
	startingStage: 0,
};
