export enum Scene {
	HOME = 'home',
	DIFFICULTY = 'difficulty',
	CHARACTERS = 'characters',
	PRACTICE_STAGE = 'practice-stage',
	OPTIONS = 'options',
	GAME = 'game',
	KEYCONFIG = 'keyconfig',
	LEADERBOARD = 'leaderboard',
}

export class SceneManager {
	private currentScene: Scene;
	private sections: Map<Scene, HTMLElement>;
	private switchedThisFrame: boolean = false;

	constructor() {
		this.sections = new Map([
			[Scene.HOME, this.getElem('home')],
			[Scene.DIFFICULTY, this.getElem('difficulty')],
			[Scene.CHARACTERS, this.getElem('characters')],
			[Scene.PRACTICE_STAGE, this.getElem('practice-stage')],
			[Scene.OPTIONS, this.getElem('options')],
			[Scene.GAME, this.getElem('game')],
			[Scene.KEYCONFIG, this.getElem('keyconfig')],
			[Scene.LEADERBOARD, this.getElem('leaderboard')],
		]);
		this.currentScene = Scene.HOME;
		this.switchTo(Scene.HOME);
	}

	getElem(id: string): HTMLElement {
		const elem = document.getElementById(id)!;
		return elem;
	}

	switchTo(scene: Scene): void {
		for (const el of this.sections.values()) {
			el.style.display = 'none';
		}
		this.sections.get(scene)!.style.display = 'flex';
		this.currentScene = scene;
		this.switchedThisFrame = true;
		setTimeout(() => {
			this.switchedThisFrame = false;
		}, 0);
	}

	hasSwitchedThisFrame(): boolean {
		return this.switchedThisFrame;
	}

	getCurrentScene(): Scene {
		return this.currentScene;
	}
}
