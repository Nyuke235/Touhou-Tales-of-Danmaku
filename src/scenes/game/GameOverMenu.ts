import { InputManager } from '../../systems/InputManager';
import { SceneManager, Scene } from '../../systems/SceneManager';
import { Controls } from '../../systems/Controls';
import { SoundManager, SFX } from '../../systems/SoundManager';
import { Difficulty } from '../../game/GameState';

const ENTER_DURATION = 400;
const LEAVE_DURATION = 250;

export interface GameOverStats {
	score: number;
	difficulty: Difficulty;
	playingTime: number;
	misses: number;
	bombsUsed: number;
	enemiesDefeated: number;
}

function formatTime(ms: number): string {
	const s = Math.floor(ms / 1000);
	const min = Math.floor(s / 60);
	const sec = s % 60;
	return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export class GameOverMenu {
	private el: HTMLElement;
	private btns: HTMLButtonElement[];
	private index: number = 0;
	private visible: boolean = false;
	private closing: boolean = false;

	private onBackToTitle: () => void;
	private onRestart: () => void;

	constructor(
		inputManager: InputManager,
		sceneManager: SceneManager,
		callbacks: { onBackToTitle: () => void; onRestart: () => void }
	) {
		this.el = document.getElementById('gameover-menu')!;
		this.btns = Array.from(this.el.querySelectorAll('.go-btn'));
		this.onBackToTitle = callbacks.onBackToTitle;
		this.onRestart = callbacks.onRestart;

		this.bindKeyboard(inputManager, sceneManager);
	}

	show(stats: GameOverStats): void {
		if (this.visible) return;
		this.visible = true;
		this.closing = false;
		this.index = 0;
		this.updateSelection();
		this.populate(stats);
		this.el.classList.remove('leaving');
		this.el.classList.add('visible', 'entering');
		setTimeout(() => this.el.classList.remove('entering'), ENTER_DURATION);
	}

	hide(callback?: () => void): void {
		if (!this.visible || this.closing) {
			callback?.();
			return;
		}
		this.closing = true;
		this.el.classList.add('leaving');
		setTimeout(() => {
			this.el.classList.remove('visible', 'leaving');
			this.visible = false;
			this.closing = false;
			callback?.();
		}, LEAVE_DURATION);
	}

	isVisible(): boolean {
		return this.visible && !this.closing;
	}
	isActive(): boolean {
		return this.visible;
	}

	setCallbacks(callbacks: {
		onBackToTitle: () => void;
		onRestart: () => void;
	}): void {
		this.onBackToTitle = callbacks.onBackToTitle;
		this.onRestart = callbacks.onRestart;
	}

	private populate(stats: GameOverStats): void {
		document.getElementById('go-score')!.textContent = stats.score
			.toString()
			.padStart(11, '0');
		document.getElementById('go-difficulty')!.textContent = stats.difficulty;
		document.getElementById('go-time')!.textContent = formatTime(
			stats.playingTime
		);
		document.getElementById('go-misses')!.textContent = stats.misses.toString();
		document.getElementById('go-bombs')!.textContent =
			stats.bombsUsed.toString();
		document.getElementById('go-enemies')!.textContent =
			stats.enemiesDefeated.toString();
	}

	private bindKeyboard(
		inputManager: InputManager,
		sceneManager: SceneManager
	): void {
		inputManager.onKeyDown(code => {
			if (!this.isVisible()) return;
			if (sceneManager.getCurrentScene() !== Scene.GAME) return;

			if (code === Controls.MOVE_UP) {
				this.index = (this.index - 1 + this.btns.length) % this.btns.length;
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.updateSelection();
			} else if (code === Controls.MOVE_DOWN) {
				this.index = (this.index + 1) % this.btns.length;
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.updateSelection();
			} else if (code === Controls.MENU_SELECT) {
				this.confirm();
			}
		});
	}

	private updateSelection(): void {
		this.btns.forEach((btn, i) =>
			btn.classList.toggle('selected', i === this.index)
		);
	}

	private confirm(): void {
		SoundManager.play(SFX.UI_SELECT);
		if (this.index === 0) this.hide(() => this.onBackToTitle());
		else this.hide(() => this.onRestart());
	}
}
