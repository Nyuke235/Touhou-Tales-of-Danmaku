import { SceneManager, Scene } from '../systems/SceneManager';
import { InputManager } from '../systems/InputManager';
import { Controls } from '../systems/Controls';
import { GameState } from '../game/GameState';
import { SoundManager, SFX } from '../systems/SoundManager';
import { MenuScene } from './MenuScene';

export class HomeScene extends MenuScene {
	private buttons: HTMLButtonElement[];
	private selectedIndex: number = 0;

	private buttonSceneMap: (Scene | undefined)[] = [
		Scene.DIFFICULTY,
		Scene.DIFFICULTY,
		Scene.DIFFICULTY,
		Scene.LEADERBOARD,
		undefined,
		undefined,
		Scene.OPTIONS,
	];

	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.HOME);
		this.buttons = Array.from(
			document.querySelectorAll<HTMLButtonElement>('#home .menu button')
		);

		this.bindMouse();
		this.updateSelection();
	}

	private bindMouse(): void {
		this.buttons.forEach((btn, index) => {
			btn.addEventListener('mouseenter', () => {
				if (this.selectedIndex !== index) SoundManager.play(SFX.UI_HIGHLIGHT);
				this.selectedIndex = index;
				this.updateSelection();
			});

			btn.addEventListener('click', () => {
				this.confirm();
			});
		});
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
	}

	private updateSelection(): void {
		this.buttons.forEach((btn, index) => {
			btn.classList.toggle('selected', index === this.selectedIndex);
		});
	}

	private confirm(): void {
		const target = this.buttonSceneMap[this.selectedIndex];
		if (!target) return;
		const home = document.getElementById('home')!;
		if (home.classList.contains('outro')) return;
		SoundManager.play(SFX.UI_SELECT);
		GameState.practiceMode = this.selectedIndex === 1;
		GameState.spellcardMode = this.selectedIndex === 2;
		if (!GameState.practiceMode && !GameState.spellcardMode)
			GameState.startingStage = 0;
		home.classList.add('outro');
		setTimeout(() => this.sceneManager.switchTo(target), 620);
	}
}
