import { SceneManager, Scene } from '../../systems/SceneManager';
import { InputManager } from '../../systems/InputManager';
import { Controls } from '../../systems/Controls';
import { MenuScene } from './MenuScene';

export class CreditsScene extends MenuScene {
	private content: HTMLElement;

	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.CREDITS);
		this.content = document.getElementById('cr-content')!;
	}

	protected onKeyDown(code: string): void {
		if (code === Controls.BACK) {
			this.sceneManager.switchTo(Scene.SPECIAL);
		}
		if (code === Controls.MOVE_UP) {
			this.content.scrollBy({ top: -24 });
		}
		if (code === Controls.MOVE_DOWN) {
			this.content.scrollBy({ top: 24 });
		}
	}
}
