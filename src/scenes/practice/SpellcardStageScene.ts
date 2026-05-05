import { SceneManager, Scene } from '../../systems/SceneManager';
import { InputManager } from '../../systems/InputManager';
import { Controls } from '../../systems/Controls';
import { GameState } from '../../game/GameState';
import { SoundManager, SFX } from '../../systems/SoundManager';
import { SPELLCARD_REGISTRY } from '../../game/SpellcardRegistry';
import { MenuScene } from '../menu/MenuScene';

export class SpellcardStageScene extends MenuScene {
	private selectedIndex: number = 0;
	private items: HTMLElement[] = [];

	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.SPELLCARD_STAGE);

		const list = document.getElementById('sc-stage-list')!;
		SPELLCARD_REGISTRY.forEach(group => {
			const li = document.createElement('li');
			li.className = 'sc-list-item';
			li.textContent = group.stageLabel;
			list.appendChild(li);
		});
		this.items = Array.from(list.querySelectorAll('.sc-list-item'));

		this.updateSelection();
		this.bindMouse();
	}

	protected onKeyDown(code: string): void {
		if (code === Controls.MOVE_UP) {
			this.selectedIndex =
				(this.selectedIndex - 1 + this.items.length) % this.items.length;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.updateSelection();
		}
		if (code === Controls.MOVE_DOWN) {
			this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.updateSelection();
		}
		if (code === Controls.MENU_SELECT) {
			SoundManager.play(SFX.UI_SELECT);
			GameState.spellcardGroupIndex = this.selectedIndex;
			this.switchWithOutro(Scene.SPELLCARD_LIST);
		}
		if (code === Controls.BACK) {
			this.switchWithOutro(Scene.CHARACTERS);
		}
	}

	private bindMouse(): void {
		this.items.forEach((item, i) => {
			item.addEventListener('mouseenter', () => {
				if (this.selectedIndex !== i) SoundManager.play(SFX.UI_HIGHLIGHT);
				this.selectedIndex = i;
				this.updateSelection();
			});
			item.addEventListener('click', () => {
				if (this.sceneManager.getCurrentScene() !== Scene.SPELLCARD_STAGE)
					return;
				SoundManager.play(SFX.UI_SELECT);
				GameState.spellcardGroupIndex = i;
				this.switchWithOutro(Scene.SPELLCARD_LIST);
			});
		});
	}

	private updateSelection(): void {
		this.items.forEach((item, i) =>
			item.classList.toggle('selected', i === this.selectedIndex)
		);
	}

	private switchWithOutro(target: Scene): void {
		this.sceneManager.switchTo(target);
	}
}
