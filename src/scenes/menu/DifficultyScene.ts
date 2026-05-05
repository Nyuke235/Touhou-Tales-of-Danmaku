import { SceneManager, Scene } from '../../systems/SceneManager';
import { InputManager } from '../../systems/InputManager';
import { Controls } from '../../systems/Controls';
import { GameState, Difficulty } from '../../game/GameState';
import { SoundManager, SFX } from '../../systems/SoundManager';
import { MenuScene } from './MenuScene';

const DIFFICULTIES = [
	Difficulty.EASY,
	Difficulty.NORMAL,
	Difficulty.HARD,
	Difficulty.LUNATIC,
];

// prettier-ignore
const DIFF_META = new Map<Difficulty, { cssClass: string; description: string }>([
    [Difficulty.EASY,    { cssClass: "easy",    description: "A gentle invitation to tea\nFor newcomers." }],
    [Difficulty.NORMAL,  { cssClass: "normal",  description: "The mist is thickening\nThe standard experience." }],
    [Difficulty.HARD,    { cssClass: "hard",    description: "The Mansion's true power awakens\nFor seasoned veterans." }],
    [Difficulty.LUNATIC, { cssClass: "lunatic", description: "The moon has turned blood-red\nGive up your sanity or perish." }],
]);

export class DifficultyScene extends MenuScene {
	private difficultyIndex: number = 1;

	private diffName: HTMLElement;
	private diffCounter: HTMLElement;
	private diffDesc: HTMLElement;

	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.DIFFICULTY);
		this.diffName = document.getElementById('diff-name')!;
		this.diffCounter = document.getElementById('diff-counter')!;
		this.diffDesc = document.getElementById('diff-description')!;

		this.update();
		this.bindMouse();
	}

	protected onKeyDown(code: string): void {
		if (code === Controls.MOVE_LEFT) {
			this.difficultyIndex =
				(this.difficultyIndex - 1 + DIFFICULTIES.length) % DIFFICULTIES.length;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.update();
		}
		if (code === Controls.MOVE_RIGHT) {
			this.difficultyIndex = (this.difficultyIndex + 1) % DIFFICULTIES.length;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.update();
		}
		if (code === Controls.MENU_SELECT) {
			SoundManager.play(SFX.UI_SELECT);
			GameState.difficulty = DIFFICULTIES[this.difficultyIndex];
			this.switchWithOutro(Scene.CHARACTERS);
		}
		if (code === Controls.BACK) {
			this.switchWithOutro(Scene.HOME);
		}
	}

	private bindMouse(): void {
		document.querySelector('.arrow-left')!.addEventListener('click', () => {
			if (this.sceneManager.getCurrentScene() !== Scene.DIFFICULTY) return;
			this.difficultyIndex =
				(this.difficultyIndex - 1 + DIFFICULTIES.length) % DIFFICULTIES.length;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.update();
		});
		document.querySelector('.arrow-right')!.addEventListener('click', () => {
			if (this.sceneManager.getCurrentScene() !== Scene.DIFFICULTY) return;
			this.difficultyIndex = (this.difficultyIndex + 1) % DIFFICULTIES.length;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.update();
		});
	}

	private switchWithOutro(target: Scene): void {
		const section = document.getElementById('difficulty')!;
		if (section.classList.contains('outro')) return;
		section.classList.add('outro');
		setTimeout(() => this.sceneManager.switchTo(target), 400);
	}

	private update(): void {
		const diff = DIFFICULTIES[this.difficultyIndex];
		const meta = DIFF_META.get(diff)!;

		GameState.difficulty = diff;
		this.diffName.textContent = diff;
		this.diffName.className = meta.cssClass;
		this.diffCounter.textContent = `${this.difficultyIndex + 1} / ${DIFFICULTIES.length}`;
		this.diffDesc.innerHTML = meta.description.replace('\n', '<br>');
	}
}
