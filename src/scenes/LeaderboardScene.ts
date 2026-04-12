import { Controls } from '../systems/Controls';
import { InputManager } from '../systems/InputManager';
import { Scene, SceneManager } from '../systems/SceneManager';
import { MenuScene } from './MenuScene';

export class LeaderboardScene extends MenuScene {
	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.LEADERBOARD);
	}

	protected onKeyDown(code: string): void {
		if (code === Controls.BACK) {
			this.sceneManager.switchTo(Scene.HOME);
		}
	}
}
