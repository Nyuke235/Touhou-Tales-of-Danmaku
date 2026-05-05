import { SceneManager, Scene } from '../../systems/SceneManager';
import { InputManager } from '../../systems/InputManager';
import { Controls } from '../../systems/Controls';
import { GameState } from '../../game/GameState';
import { SoundManager, SFX } from '../../systems/SoundManager';
import { SPELLCARD_REGISTRY } from '../../game/SpellcardRegistry';
import { MenuScene } from '../menu/MenuScene';

export class SpellcardListScene extends MenuScene {
	private selectedIndex: number = 0;
	private items: HTMLElement[] = [];

	private stageTitle: HTMLElement;
	private list: HTMLElement;

	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.SPELLCARD_LIST);
		this.stageTitle = document.getElementById('sc-list-stage-title')!;
		this.list = document.getElementById('sc-spellcard-list')!;
	}

	onEnter(): void {
		this.selectedIndex = 0;
		this.rebuild();
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
			GameState.spellcardEntryIndex = this.selectedIndex;
			this.switchWithOutro(Scene.GAME);
		}
		if (code === Controls.BACK) {
			this.switchWithOutro(Scene.SPELLCARD_STAGE);
		}
	}

	private rebuild(): void {
		this.list.innerHTML = '';
		const group = SPELLCARD_REGISTRY[GameState.spellcardGroupIndex];
		this.stageTitle.textContent = group.stageLabel;

		group.spellcards.forEach(entry => {
			const li = document.createElement('li');
			li.className = 'sc-list-item';

			const nameEl = document.createElement('span');
			nameEl.className = 'sc-spell-name';
			nameEl.textContent = entry.name;

			const bossEl = document.createElement('span');
			bossEl.className = 'sc-spell-boss';
			bossEl.textContent = entry.bossName;

			li.appendChild(nameEl);
			li.appendChild(bossEl);
			this.list.appendChild(li);
		});

		this.items = Array.from(this.list.querySelectorAll('.sc-list-item'));
		this.updateSelection();
		this.bindMouse();
	}

	private bindMouse(): void {
		this.items.forEach((item, i) => {
			item.addEventListener('mouseenter', () => {
				if (this.selectedIndex !== i) SoundManager.play(SFX.UI_HIGHLIGHT);
				this.selectedIndex = i;
				this.updateSelection();
			});
			item.addEventListener('click', () => {
				if (this.sceneManager.getCurrentScene() !== Scene.SPELLCARD_LIST)
					return;
				SoundManager.play(SFX.UI_SELECT);
				GameState.spellcardEntryIndex = i;
				this.switchWithOutro(Scene.GAME);
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
