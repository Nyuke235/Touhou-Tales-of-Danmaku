import { SceneManager, Scene } from '../../systems/SceneManager';
import { InputManager } from '../../systems/InputManager';
import { Controls, setControls } from '../../systems/Controls';
import { MusicManager } from '../../systems/MusicManager';
import { SoundManager, SFX } from '../../systems/SoundManager';
import { LocalSettings } from '../../systems/LocalSettings';
import { GameState } from '../../game/GameState';
import { MenuScene } from './MenuScene';

const OPTION_COUNT = 7;
const LOW_DETAILS_INDEX = 2;
const ERASE_DATA_INDEX = 5;

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
	private lowDetailsBtn: HTMLButtonElement | null;
	private eraseDataBtn: HTMLButtonElement | null;
	private confirmingErase: boolean = false;

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
		this.lowDetailsBtn = document.getElementById(
			'low-details-btn'
		) as HTMLButtonElement | null;
		this.eraseDataBtn = document.getElementById(
			'erase-data-btn'
		) as HTMLButtonElement | null;

		this.syncFromManagers();
		this.updateSelection();
	}

	private syncFromManagers(): void {
		this.bgmVolume = Math.round(MusicManager.getVolume() * VOLUME_STEPS);
		this.seVolume = Math.round(SoundManager.getVolume() * VOLUME_STEPS);

		this.updateBar('bgm-bar', this.bgmVolume);
		this.updateBar('se-bar', this.seVolume);
		this.updateLowDetailsLabel();
		this.updateEraseDataLabel();
	}

	protected onKeyDown(code: string): void {
		if (code === Controls.MOVE_UP) {
			this.cancelEraseConfirm();
			this.selectedIndex =
				(this.selectedIndex - 1 + OPTION_COUNT) % OPTION_COUNT;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.updateSelection();
		}
		if (code === Controls.MOVE_DOWN) {
			this.cancelEraseConfirm();
			this.selectedIndex = (this.selectedIndex + 1) % OPTION_COUNT;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.updateSelection();
		}
		if (code === Controls.MOVE_LEFT || code === Controls.MOVE_RIGHT) {
			if (this.selectedIndex < 2) {
				const delta = code === Controls.MOVE_LEFT ? -1 : +1;
				this.changeVolume(this.selectedIndex, delta);
			} else if (this.selectedIndex === LOW_DETAILS_INDEX) {
				this.toggleLowDetails();
			}
		}
		if (code === Controls.MENU_SELECT) {
			this.confirm();
		}
		if (code === Controls.BACK) {
			if (this.confirmingErase) {
				this.cancelEraseConfirm();
				return;
			}
			LocalSettings.save();
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
				this.toggleLowDetails();
				break;
			case 3:
				this.switchWithOutro(Scene.KEYCONFIG);
				break;
			case 4:
				this.resetDefaults();
				break;
			case ERASE_DATA_INDEX:
				this.handleEraseData();
				break;
			case 6:
				LocalSettings.save();
				this.switchWithOutro(Scene.HOME);
				break;
		}
	}

	private handleEraseData(): void {
		if (!this.confirmingErase) {
			this.confirmingErase = true;
			this.updateEraseDataLabel();
			return;
		}
		localStorage.clear();
		location.reload();
	}

	private cancelEraseConfirm(): void {
		if (!this.confirmingErase) return;
		this.confirmingErase = false;
		this.updateEraseDataLabel();
	}

	private updateEraseDataLabel(): void {
		if (!this.eraseDataBtn) return;
		this.eraseDataBtn.textContent = this.confirmingErase
			? 'Are you sure?'
			: 'Erase data';
	}

	private toggleLowDetails(): void {
		GameState.lowDetails = !GameState.lowDetails;
		this.updateLowDetailsLabel();
	}

	private updateLowDetailsLabel(): void {
		if (this.lowDetailsBtn) {
			this.lowDetailsBtn.textContent = `Low details: ${GameState.lowDetails ? 'ON' : 'OFF'}`;
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
		GameState.lowDetails = false;
		this.updateLowDetailsLabel();
	}
}
