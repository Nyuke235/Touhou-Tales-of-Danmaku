import { SceneManager, Scene } from '../../systems/SceneManager';
import { InputManager } from '../../systems/InputManager';
import { Controls, setControls } from '../../systems/Controls';
import { MusicManager } from '../../systems/MusicManager';
import { SoundManager, SFX } from '../../systems/SoundManager';
import { SaveManager } from '../../systems/SaveManager';
import { MenuScene } from './MenuScene';

const VOLUME_STEPS = 5;

const DEFAULT_CONTROLS = {
	MENU_SELECT: 'Enter',
	MOVE_UP: 'ArrowUp',
	MOVE_DOWN: 'ArrowDown',
	MOVE_LEFT: 'ArrowLeft',
	MOVE_RIGHT: 'ArrowRight',
	SHOOT: 'KeyZ',
	BOMB: 'KeyX',
	FOCUS: 'ShiftLeft',
	BACK: 'Escape',
};

const DEFAULT_BGM_VOLUME = 0.7;
const DEFAULT_SE_VOLUME = 0.8;

export class OptionsScene extends MenuScene {
	private selectedIndex: number = 0;

	private bgmVolume: number = VOLUME_STEPS;
	private seVolume: number = VOLUME_STEPS;

	private optionLines: HTMLElement[];
	private singleBtns: HTMLButtonElement[];

	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.OPTIONS);
		this.optionLines = Array.from(
			document.querySelectorAll<HTMLElement>('#options .option-line')
		);
		this.singleBtns = Array.from(
			document.querySelectorAll<HTMLButtonElement>(
				'#options .menu > button.single-btn'
			)
		);

		this.syncFromManagers();
		this.bindMouse();
		this.updateSelection();
	}

	private syncFromManagers(): void {
		this.bgmVolume = Math.round(MusicManager.getVolume() * VOLUME_STEPS);
		this.seVolume = Math.round(SoundManager.getVolume() * VOLUME_STEPS);

		this.updateBar('bgm-bar', this.bgmVolume);
		this.updateBar('se-bar', this.seVolume);
	}

	private bindMouse(): void {
		this.optionLines.forEach((line, index) => {
			line.addEventListener('mouseenter', () => {
				if (this.selectedIndex !== index) SoundManager.play(SFX.UI_HIGHLIGHT);
				this.selectedIndex = index;
				this.updateSelection();
			});
		});

		document.querySelectorAll('#bgm-bar .segment').forEach((seg, i) => {
			seg.addEventListener('click', () => {
				this.selectedIndex = 0;
				SoundManager.play(SFX.UI_SELECT);
				this.setVolume(0, i + 1);
			});
		});
		document.querySelectorAll('#se-bar .segment').forEach((seg, i) => {
			seg.addEventListener('click', () => {
				this.selectedIndex = 1;
				SoundManager.play(SFX.UI_SELECT);
				this.setVolume(1, i + 1);
			});
		});

		this.singleBtns.forEach((btn, index) => {
			btn.addEventListener('mouseenter', () => {
				if (this.selectedIndex !== 2 + index)
					SoundManager.play(SFX.UI_HIGHLIGHT);
				this.selectedIndex = 2 + index;
				this.updateSelection();
			});
			btn.addEventListener('click', () => this.confirm());
		});
	}

	protected onKeyDown(code: string): void {
		if (code === Controls.MOVE_UP) {
			this.selectedIndex = (this.selectedIndex - 1 + 5) % 5;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.updateSelection();
		}
		if (code === Controls.MOVE_DOWN) {
			this.selectedIndex = (this.selectedIndex + 1) % 5;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.updateSelection();
		}
		if (code === Controls.MOVE_LEFT && this.selectedIndex < 2) {
			this.changeVolume(this.selectedIndex, -1);
		}
		if (code === Controls.MOVE_RIGHT && this.selectedIndex < 2) {
			this.changeVolume(this.selectedIndex, +1);
		}
		if (code === Controls.MENU_SELECT) {
			this.confirm();
		}
		if (code === Controls.BACK) {
			const currentUser = localStorage.getItem('loggedUser');
			if (currentUser) SaveManager.saveSettings(currentUser);

			this.switchWithOutro(Scene.HOME);
		}
	}

	private setVolume(lineIndex: number, steps: number): void {
		const clamped = Math.max(0, Math.min(VOLUME_STEPS, steps));
		if (lineIndex === 0) {
			this.bgmVolume = clamped;
			MusicManager.setVolume(this.bgmVolume / VOLUME_STEPS);
			this.updateBar('bgm-bar', this.bgmVolume);
		} else {
			this.seVolume = clamped;
			SoundManager.setVolume(this.seVolume / VOLUME_STEPS);
			this.updateBar('se-bar', this.seVolume);
		}
	}

	private changeVolume(lineIndex: number, delta: number): void {
		if (lineIndex === 0) {
			this.setVolume(0, this.bgmVolume + delta);
		} else {
			this.setVolume(1, this.seVolume + delta);
		}
	}

	private toggleMute(lineIndex: number): void {
		if (lineIndex === 0) {
			this.setVolume(0, this.bgmVolume > 0 ? 0 : VOLUME_STEPS);
		} else {
			this.setVolume(1, this.seVolume > 0 ? 0 : VOLUME_STEPS);
		}
	}

	private updateBar(barId: string, steps: number): void {
		const bar = document.getElementById(barId);
		if (!bar) return;
		bar.querySelectorAll('.segment').forEach((seg, i) => {
			seg.classList.toggle('filled', i < steps);
		});
	}

	private updateSelection(): void {
		this.optionLines.forEach((line, i) =>
			line.classList.toggle('selected', i === this.selectedIndex)
		);
		this.singleBtns.forEach((btn, i) =>
			btn.classList.toggle('selected', 2 + i === this.selectedIndex)
		);
	}

	private confirm(): void {
		SoundManager.play(SFX.UI_SELECT);
		switch (this.selectedIndex) {
			case 0:
				this.toggleMute(0);
				break;
			case 1:
				this.toggleMute(1);
				break;
			case 2:
				this.switchWithOutro(Scene.KEYCONFIG);
				break;
			case 3:
				this.resetDefaults();
				break;
			case 4:
				const currentUser = localStorage.getItem('loggedUser');
				if (currentUser) SaveManager.saveSettings(currentUser);
				this.switchWithOutro(Scene.HOME);
				break;
		}
	}

	private switchWithOutro(target: Scene): void {
		const section = document.getElementById('options')!;
		if (section.classList.contains('outro')) return;
		section.classList.add('outro');
		setTimeout(() => this.sceneManager.switchTo(target), 500);
	}

	private resetDefaults(): void {
		setControls(DEFAULT_CONTROLS);
		this.setVolume(0, Math.round(DEFAULT_BGM_VOLUME * VOLUME_STEPS));
		this.setVolume(1, Math.round(DEFAULT_SE_VOLUME * VOLUME_STEPS));
	}
}
