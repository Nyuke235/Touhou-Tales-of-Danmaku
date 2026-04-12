import { Difficulty } from '../game/GameState';

const DIFF_COEF = new Map<Difficulty, number>([
	[Difficulty.EASY, 0.5],
	[Difficulty.NORMAL, 1.0],
	[Difficulty.HARD, 1.2],
	[Difficulty.LUNATIC, 1.5],
]);

export class ScoreManager {
	static GRAZE = 100;
	static HIT = 10;
	static POINT = 1000;
	static BIG_POINT = 10000;
	static POWER = 500;
	static BIG_POWER = 5000;

	private score: number = 0;
	private coef: number;

	constructor(difficulty: Difficulty) {
		this.coef = DIFF_COEF.get(difficulty)!;
	}

	add(base: number): void {
		this.score += Math.floor(base * this.coef);
	}

	get value(): number {
		return this.score;
	}

	reset(): void {
		this.score = 0;
	}
}
