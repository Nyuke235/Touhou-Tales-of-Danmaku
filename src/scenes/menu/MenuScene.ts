import { SceneManager, Scene } from '../../systems/SceneManager';
import { InputManager } from '../../systems/InputManager';

export abstract class MenuScene {
	protected sceneManager: SceneManager;
	private readonly scene: Scene;

	constructor(
		sceneManager: SceneManager,
		inputManager: InputManager,
		scene: Scene
	) {
		this.sceneManager = sceneManager;
		this.scene = scene;
		inputManager.onKeyDown(code => {
			if (this.sceneManager.getCurrentScene() !== this.scene) return;
			if (this.sceneManager.hasSwitchedThisFrame()) return;
			this.onKeyDown(code);
		});
	}

	protected abstract onKeyDown(code: string): void;
}
