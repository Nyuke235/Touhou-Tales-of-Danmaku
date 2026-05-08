import { InputManager } from '../../systems/InputManager';
import { SceneManager, Scene } from '../../systems/SceneManager';
import { Controls } from '../../systems/Controls';
import { SoundManager, SFX } from '../../systems/SoundManager';

const ENTER_DURATION = 200;
const LEAVE_DURATION = 150;

export class SpellcardClearMenu {
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
		this.el = document.getElementById('spellcard-clear-menu')!;
		this.btns = Array.from(this.el.querySelectorAll('.sc-clear-btn'));
		this.onBackToTitle = callbacks.onBackToTitle;
		this.onRestart = callbacks.onRestart;

		this.bindKeyboard(inputManager, sceneManager);
	}

	show(): void {
		if (this.visible) return;
		this.visible = true;
		this.closing = false;
		this.index = 0;
		this.updateSelection();
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

	isActive(): boolean {
		return this.visible;
	}

	private updateSelection(): void {
		this.btns.forEach((btn, i) =>
			btn.classList.toggle('selected', i === this.index)
		);
	}

	private bindKeyboard(
		inputManager: InputManager,
		sceneManager: SceneManager
	): void {
		inputManager.onKeyDown(code => {
			if (!this.visible) return;
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

	private confirm(): void {
		SoundManager.play(SFX.UI_SELECT);
		if (this.index === 0) {
			this.hide(() => this.onBackToTitle());
		} else {
			this.hide(() => this.onRestart());
		}
	}
}
