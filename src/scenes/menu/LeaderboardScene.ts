import { Controls } from '../../systems/Controls';
import { InputManager } from '../../systems/InputManager';
import { Scene, SceneManager } from '../../systems/SceneManager';
import { MenuScene } from './MenuScene';
import { LeaderboardManagement } from '../../systems/LeaderboardManager';
import { SoundManager, SFX } from '../../systems/SoundManager';

export class LeaderboardScene extends MenuScene {
	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.LEADERBOARD);

		document.querySelectorAll<HTMLElement>('.lb-tab').forEach(btn => {
			btn.addEventListener('click', () => {
				const mode = btn.dataset.mode as 'global' | 'local';
				if (LeaderboardManagement.mode !== mode) {
					LeaderboardManagement.mode = mode;
					SoundManager.play(SFX.UI_HIGHLIGHT);
					LeaderboardManagement.generateLeaderboard();
				}
			});
		});
	}

	protected onKeyDown(code: string): void {
		if (code === Controls.BACK) {
			this.sceneManager.switchTo(Scene.HOME);
		}
		if (code === Controls.MOVE_LEFT || code === Controls.MOVE_RIGHT) {
			LeaderboardManagement.mode =
				LeaderboardManagement.mode === 'global' ? 'local' : 'global';
			SoundManager.play(SFX.UI_HIGHLIGHT);
			LeaderboardManagement.generateLeaderboard();
		}
	}
}
