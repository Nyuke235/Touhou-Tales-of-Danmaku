import { Difficulty } from '../../game/GameState';

const DISPLAY_DURATION = 3400;
const LEAVE_DURATION = 500;

export interface StageClearStats {
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

export class StageClearMenu {
	private el: HTMLElement;
	private visible: boolean = false;

	private onContinue: () => void;

	constructor(callbacks: { onContinue: () => void }) {
		this.el = document.getElementById('stageclear-overlay')!;
		this.onContinue = callbacks.onContinue;
	}

	show(stats: StageClearStats): void {
		if (this.visible) return;
		this.visible = true;
		this.populate(stats);
		this.el.classList.remove('leaving');
		void this.el.offsetWidth;
		this.el.classList.add('visible');

		setTimeout(() => {
			this.el.classList.add('leaving');
			setTimeout(() => {
				this.el.classList.remove('visible', 'leaving');
				this.visible = false;
				this.onContinue();
			}, LEAVE_DURATION);
		}, DISPLAY_DURATION);
	}

	isActive(): boolean {
		return this.visible;
	}

	setCallbacks(callbacks: { onContinue: () => void }): void {
		this.onContinue = callbacks.onContinue;
	}

	private populate(stats: StageClearStats): void {
		document.getElementById('sc-score')!.textContent = stats.score
			.toString()
			.padStart(11, '0');
		document.getElementById('sc-difficulty')!.textContent = stats.difficulty;
		document.getElementById('sc-time')!.textContent = formatTime(
			stats.playingTime
		);
		document.getElementById('sc-misses')!.textContent = stats.misses.toString();
		document.getElementById('sc-bombs')!.textContent =
			stats.bombsUsed.toString();
		document.getElementById('sc-enemies')!.textContent =
			stats.enemiesDefeated.toString();
	}
}
