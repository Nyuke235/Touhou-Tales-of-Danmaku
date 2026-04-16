import { SceneManager, Scene } from '../systems/SceneManager';
import { InputManager } from '../systems/InputManager';
import { Controls } from '../systems/Controls';
import { GameState } from '../game/GameState';
import { SoundManager, SFX } from '../systems/SoundManager';
import { STAGES } from '../stages/stages';
import { MenuScene } from './MenuScene';

export class PracticeStageScene extends MenuScene {
	private stageIndex: number = 0;

	private psNumber: HTMLElement;
	private psName: HTMLElement;
	private psCounter: HTMLElement;
	private psDescription: HTMLElement;

	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.PRACTICE_STAGE);
		this.psNumber = document.getElementById('ps-number')!;
		this.psName = document.getElementById('ps-name')!;
		this.psCounter = document.getElementById('ps-counter')!;
		this.psDescription = document.getElementById('ps-description')!;

		this.update();
		this.bindMouse();
	}

	protected onKeyDown(code: string): void {
		if (code === Controls.MOVE_LEFT) {
			this.stageIndex = (this.stageIndex - 1 + STAGES.length) % STAGES.length;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.update();
		}
		if (code === Controls.MOVE_RIGHT) {
			this.stageIndex = (this.stageIndex + 1) % STAGES.length;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.update();
		}
		if (code === Controls.MENU_SELECT) {
			SoundManager.play(SFX.UI_SELECT);
			GameState.startingStage = this.stageIndex;
			this.switchWithOutro(Scene.GAME);
		}
		if (code === Controls.BACK) {
			this.switchWithOutro(Scene.CHARACTERS);
		}
	}

	private bindMouse(): void {
		document
			.querySelector('#practice-stage .arrow-left')!
			.addEventListener('click', () => {
				if (this.sceneManager.getCurrentScene() !== Scene.PRACTICE_STAGE)
					return;
				this.stageIndex = (this.stageIndex - 1 + STAGES.length) % STAGES.length;
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.update();
			});
		document
			.querySelector('#practice-stage .arrow-right')!
			.addEventListener('click', () => {
				if (this.sceneManager.getCurrentScene() !== Scene.PRACTICE_STAGE)
					return;
				this.stageIndex = (this.stageIndex + 1) % STAGES.length;
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.update();
			});
	}

	private switchWithOutro(target: Scene): void {
		const section = document.getElementById('practice-stage')!;
		if (section.classList.contains('outro')) return;
		section.classList.add('outro');
		setTimeout(() => this.sceneManager.switchTo(target), 400);
	}

	private update(): void {
		const stage = STAGES[this.stageIndex];
		this.psNumber.textContent = stage.number;
		this.psName.textContent = stage.name;
		this.psCounter.textContent = `${this.stageIndex + 1} / ${STAGES.length}`;
		this.psDescription.textContent = stage.description;
	}
}
