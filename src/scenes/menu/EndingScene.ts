import { SceneManager, Scene } from '../../systems/SceneManager';
import { InputManager } from '../../systems/InputManager';
import { Controls } from '../../systems/Controls';
import { MusicManager, Music } from '../../systems/MusicManager';
import { MenuScene } from './MenuScene';

const HOLD_BEFORE_SCROLL_MS = 4000;
const SCROLL_DURATION_MS = 50000;

export class EndingScene extends MenuScene {
	private section: HTMLElement;
	private active: boolean = false;
	private timers: number[] = [];

	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.ENDING);
		this.section = document.getElementById('ending')!;
	}

	onEnter(): void {
		if (this.active) return;
		this.active = true;

		MusicManager.play(Music.ENDING);

		this.section.classList.remove('active', 'scrolling');
		void this.section.offsetWidth;
		this.section.classList.add('active');

		const scrollTimer = window.setTimeout(() => {
			this.section.classList.add('scrolling');
		}, HOLD_BEFORE_SCROLL_MS);

		const endTimer = window.setTimeout(
			() => this.finish(),
			HOLD_BEFORE_SCROLL_MS + SCROLL_DURATION_MS
		);

		this.timers.push(scrollTimer, endTimer);
	}

	protected onKeyDown(code: string): void {
		if (!this.active) return;
		if (code === Controls.MENU_SELECT || code === Controls.BACK) {
			this.finish();
		}
	}

	private finish(): void {
		if (!this.active) return;
		this.active = false;
		for (const id of this.timers) clearTimeout(id);
		this.timers = [];
		this.section.classList.remove('active', 'scrolling');
		MusicManager.stop();
		this.sceneManager.switchTo(Scene.HOME);
	}
}
