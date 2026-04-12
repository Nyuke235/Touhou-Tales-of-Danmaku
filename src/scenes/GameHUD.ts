import { Difficulty, GameState } from '../game/GameState';

const DIFF_CLASS = new Map<Difficulty, string>([
	[Difficulty.EASY, 'easy'],
	[Difficulty.NORMAL, 'normal'],
	[Difficulty.HARD, 'hard'],
	[Difficulty.LUNATIC, 'lunatic'],
]);

export class GameHUD {
	private hudDifficulty: HTMLElement;
	private hiScore: HTMLElement;
	private currentScore: HTMLElement;
	private lifeRes: HTMLElement;
	private bombRes: HTMLElement;
	private powerEl: HTMLElement;
	private pointItemsEl: HTMLElement;
	private grazeEl: HTMLElement;

	constructor() {
		this.hudDifficulty = document.getElementById('hud-difficulty')!;
		this.hiScore = document.getElementById('hi-score')!;
		this.currentScore = document.getElementById('current-score')!;
		this.lifeRes = document.getElementById('life-res')!;
		this.bombRes = document.getElementById('bomb-res')!;
		this.powerEl = document.getElementById('power')!;
		this.pointItemsEl = document.getElementById('point-items')!;
		this.grazeEl = document.getElementById('graze')!;
	}

	private renderGems(
		container: HTMLElement,
		thirds: number,
		fullGemSrc: string
	): void {
		container.innerHTML = '';
		const fullGems = Math.floor(thirds / 3);
		const remainder = thirds % 3;

		for (let i = 0; i < fullGems; i++) {
			const img = document.createElement('img');
			img.src = `assets/sprites/ui/gems/${fullGemSrc}`;
			img.className = 'gem-icon';
			container.appendChild(img);
		}

		if (remainder > 0) {
			const img = document.createElement('img');
			img.src =
				remainder === 1
					? 'assets/sprites/ui/gems/onethirdgem.png'
					: 'assets/sprites/ui/gems/twothirdgem.png';
			img.className = 'gem-icon';
			container.appendChild(img);
		}
	}

	init(difficulty: Difficulty, lives: number, bombs: number): void {
		const cssClass = DIFF_CLASS.get(difficulty) ?? 'normal';
		this.hudDifficulty.textContent = difficulty;
		this.hudDifficulty.className = cssClass;
		this.hiScore.textContent = `${GameState.highScore}`.padStart(11, '0');
		this.currentScore.textContent = '00000000000';
		this.setLives(lives);
		this.setBombs(bombs);
		this.powerEl.textContent = '0.00 / 4.00';
		this.pointItemsEl.textContent = '0';
		this.grazeEl.textContent = '0';
	}

	setScore(value: number): void {
		this.currentScore.textContent = value.toString().padStart(11, '0');
	}

	setLives(value: number): void {
		this.renderGems(this.lifeRes, value, 'lifegem.png');
	}

	setBombs(value: number): void {
		this.renderGems(this.bombRes, value, 'bombgem.png');
	}

	setPower(current: number, max: number): void {
		this.powerEl.textContent = `${current.toFixed(2)} / ${max.toFixed(2)}`;
	}

	setPointItems(value: number): void {
		this.pointItemsEl.textContent = value.toString();
	}

	setGraze(value: number): void {
		this.grazeEl.textContent = value.toString();
	}
}
