import { SceneManager, Scene } from '../../systems/SceneManager';
import { InputManager } from '../../systems/InputManager';
import { Controls } from '../../systems/Controls';
import { SoundManager, SFX } from '../../systems/SoundManager';
import { MenuScene } from './MenuScene';

type ButtonTarget = Scene | { url: string } | undefined;

const BUTTON_TARGETS: ButtonTarget[] = [
	undefined, // Archives
	undefined, // Achievements
	Scene.CREDITS, // Credits
	undefined, // Ending
	{ url: 'https://github.com/Nyuke235/Touhou-Tales-of-Danmaku' },
	{ url: 'https://nyuke235.itch.io/touhou-tales-of-danmaku' },
];

export class SpecialScene extends MenuScene {
	private buttons: HTMLButtonElement[];
	private selectedIndex: number = 0;

	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.SPECIAL);
		this.buttons = Array.from(
			document.querySelectorAll<HTMLButtonElement>('#special .menu button')
		);
		this.updateSelection();
	}

	protected onKeyDown(code: string): void {
		if (code === Controls.MOVE_UP) {
			this.selectedIndex =
				(this.selectedIndex - 1 + this.buttons.length) % this.buttons.length;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.updateSelection();
		}
		if (code === Controls.MOVE_DOWN) {
			this.selectedIndex = (this.selectedIndex + 1) % this.buttons.length;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.updateSelection();
		}
		if (code === Controls.MENU_SELECT) {
			this.confirm();
		}
		if (code === Controls.BACK) {
			this.switchWithOutro(Scene.HOME);
		}
	}

	private updateSelection(): void {
		this.buttons.forEach((btn, i) =>
			btn.classList.toggle('selected', i === this.selectedIndex)
		);
	}

	private confirm(): void {
		const target = BUTTON_TARGETS[this.selectedIndex];
		if (!target) return;
		SoundManager.play(SFX.UI_SELECT);
		if (typeof target === 'object' && 'url' in target) {
			window.open(target.url, '_blank', 'noopener,noreferrer');
			return;
		}
		this.switchWithOutro(target);
	}

	private switchWithOutro(target: Scene): void {
		const section = document.getElementById('special')!;
		if (section.classList.contains('outro')) return;
		section.classList.add('outro');
		setTimeout(() => this.sceneManager.switchTo(target), 620);
	}
}
