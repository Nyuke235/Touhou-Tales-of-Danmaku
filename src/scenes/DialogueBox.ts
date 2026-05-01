import { DialogueLine } from '../stages/DialogueRegistry';
import { MusicManager } from '../systems/MusicManager';
import { SoundManager, SFX } from '../systems/SoundManager';

const CHARS_PER_SEC = 32;
const PERIOD_PAUSE = 0.25;
const PUNCT = new Set(['.', '!', '?', '…']);

export class DialogueBox {
	private lines: DialogueLine[] = [];
	private lineIndex = 0;
	private charIndex = 0;
	private charTimer = 0;
	private pauseTimer = 0;
	private active = false;
	private onComplete: (() => void) | null = null;

	private readonly el: HTMLElement;
	private readonly portraitEl: HTMLImageElement;
	private readonly nameEl: HTMLElement;
	private readonly textEl: HTMLElement;
	private readonly arrowEl: HTMLElement;

	constructor() {
		this.el = document.getElementById('dialogue-box')!;
		this.portraitEl = this.el.querySelector(
			'.dlg-portrait'
		)! as HTMLImageElement;
		this.nameEl = this.el.querySelector('.dlg-name')!;
		this.textEl = this.el.querySelector('.dlg-text')!;
		this.arrowEl = this.el.querySelector('.dlg-arrow')!;
	}

	start(lines: DialogueLine[], onComplete: () => void): void {
		this.lines = lines;
		this.lineIndex = 0;
		this.onComplete = onComplete;
		this.active = true;

		if (lines[0]?.music) MusicManager.play(lines[0].music);
		this.resetLine();
		this.showLine();
		this.el.classList.add('visible');
	}

	isActive(): boolean {
		return this.active;
	}

	advance(): void {
		if (!this.active) return;
		const line = this.lines[this.lineIndex];

		if (this.charIndex < line.text.length) {
			// Skip typewriter to end — no skip sound
			this.pauseTimer = 0;
			this.charIndex = line.text.length;
			this.textEl.textContent = line.text;
			this.arrowEl.classList.add('visible');
			return;
		}

		// Advance to next line
		SoundManager.play(SFX.SKIP);

		this.lineIndex++;
		if (this.lineIndex >= this.lines.length) {
			this.active = false;
			this.el.classList.remove('visible');
			this.onComplete?.();
			return;
		}

		const next = this.lines[this.lineIndex];
		if (next.music) MusicManager.play(next.music);
		this.resetLine();
		this.showLine();
	}

	update(dt: number): void {
		if (!this.active) return;

		if (this.pauseTimer > 0) {
			this.pauseTimer -= dt;
			return;
		}

		const line = this.lines[this.lineIndex];
		if (this.charIndex >= line.text.length) return;

		this.charTimer -= dt;

		let soundPlayed = false;
		while (this.charTimer <= 0 && this.charIndex < line.text.length) {
			this.charIndex++;
			this.charTimer += 1 / CHARS_PER_SEC;

			const ch = line.text[this.charIndex - 1];

			if (ch !== ' ' && !soundPlayed) {
				SoundManager.play(SFX.LETTER);
				soundPlayed = true;
			}

			if (PUNCT.has(ch)) {
				this.pauseTimer = PERIOD_PAUSE;
				break;
			}
		}

		this.textEl.textContent = line.text.slice(0, this.charIndex);

		if (this.charIndex >= line.text.length) {
			this.arrowEl.classList.add('visible');
		}
	}

	hide(): void {
		this.active = false;
		this.el.classList.remove('visible');
	}

	render(_ctx: CanvasRenderingContext2D): void {}

	private resetLine(): void {
		this.charIndex = 0;
		this.charTimer = 0;
		this.pauseTimer = 0;
	}

	private showLine(): void {
		const line = this.lines[this.lineIndex];
		this.el.className = `visible speaker-${line.speaker}`;
		this.portraitEl.src = line.portrait;
		this.nameEl.textContent = line.name;
		this.textEl.textContent = '';
		this.arrowEl.classList.remove('visible');
	}
}
