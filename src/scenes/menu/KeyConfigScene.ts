import { Controls } from '../../systems/Controls';
import { InputManager } from '../../systems/InputManager';
import { SaveManager } from '../../systems/SaveManager';
import { Scene, SceneManager } from '../../systems/SceneManager';
import { SFX, SoundManager } from '../../systems/SoundManager';
import { MenuScene } from './MenuScene';

const CONTROL_MAP: Array<{ action: keyof typeof Controls }> = [
	{ action: 'MOVE_UP' },
	{ action: 'MOVE_DOWN' },
	{ action: 'MOVE_LEFT' },
	{ action: 'MOVE_RIGHT' },
	{ action: 'SHOOT' },
	{ action: 'BOMB' },
	{ action: 'FOCUS' },
];

const SIDEBAR_ACTIONS = ['arrows', 'wasd', 'exit'] as const;

const PRESETS: {
	arrows: Partial<typeof Controls>;
	wasd: Partial<typeof Controls>;
} = {
	arrows: {
		MOVE_UP: 'ArrowUp',
		MOVE_DOWN: 'ArrowDown',
		MOVE_LEFT: 'ArrowLeft',
		MOVE_RIGHT: 'ArrowRight',
		SHOOT: 'KeyZ',
		BOMB: 'KeyX',
		FOCUS: 'ShiftLeft',
	},
	wasd: {
		MOVE_UP: 'KeyW',
		MOVE_DOWN: 'KeyS',
		MOVE_LEFT: 'KeyA',
		MOVE_RIGHT: 'KeyD',
		SHOOT: 'Space',
		BOMB: 'KeyX',
		FOCUS: 'ShiftLeft',
	},
};

function codeToDisplay(code: string): string {
	if (code === 'ArrowUp') return '^';
	if (code === 'ArrowDown') return 'v';
	if (code === 'ArrowLeft') return '<';
	if (code === 'ArrowRight') return '>';
	if (code === 'Space') return 'Space';
	if (code === 'ShiftLeft' || code === 'ShiftRight') return 'Shift';
	if (code === 'ControlLeft' || code === 'ControlRight') return 'Ctrl';
	if (code === 'AltLeft' || code === 'AltRight') return 'Alt';
	if (code.startsWith('Key')) return code.slice(3).toUpperCase();
	if (code.startsWith('Digit')) return code.slice(5);
	return code;
}

export class KeyConfig extends MenuScene {
	private rows: NodeListOf<HTMLElement>;
	private valueSpans: NodeListOf<HTMLElement>;
	private sidebarBtns: HTMLElement[];

	private panel: 'keys' | 'sidebar' = 'keys';
	private index: number = 0;
	private sidebarIndex: number = 0;
	private waiting: boolean = false;

	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.KEYCONFIG);
		this.rows = document.querySelectorAll('#keyconfig .key-row');
		this.valueSpans = document.querySelectorAll('#keyconfig .key-value');
		this.sidebarBtns = [
			document.getElementById('preset-arrows')!,
			document.getElementById('preset-wasd')!,
			document.getElementById('keyconfig-exit')!,
		];
		this.loadCurrentValues();
		this.updateSelection();
		this.bindMouse();
	}

	private loadCurrentValues(): void {
		CONTROL_MAP.forEach((ctrl, i) => {
			if (this.valueSpans[i]) {
				this.valueSpans[i].textContent = codeToDisplay(Controls[ctrl.action]);
			}
		});
	}

	private bindMouse(): void {
		this.rows.forEach((row, i) => {
			row.addEventListener('mouseenter', () => {
				if (this.waiting) return;
				if (this.panel !== 'keys' || this.index !== i)
					SoundManager.play(SFX.UI_HIGHLIGHT);
				this.panel = 'keys';
				this.index = i;
				this.updateSelection();
			});
			row.addEventListener('click', () => {
				this.panel = 'keys';
				this.index = i;
				this.waiting = true;
				SoundManager.play(SFX.UI_SELECT);
				this.updateSelection();
			});
		});

		this.sidebarBtns.forEach((btn, i) => {
			btn.addEventListener('mouseenter', () => {
				if (this.waiting) return;
				if (this.panel !== 'sidebar' || this.sidebarIndex !== i)
					SoundManager.play(SFX.UI_HIGHLIGHT);
				this.panel = 'sidebar';
				this.sidebarIndex = i;
				this.updateSelection();
			});
			btn.addEventListener('click', () => this.confirmSidebar());
		});
	}

	protected onKeyDown(code: string): void {
		if (this.waiting) {
			if (code === 'Escape') {
				this.waiting = false;
				this.updateSelection();
				return;
			}
			this.assignKey(code);
			this.waiting = false;
			SoundManager.play(SFX.UI_SELECT);
			if (this.index < this.rows.length - 1) this.index++;
			this.updateSelection();
			return;
		}

		if (code === Controls.BACK) {
			this.exit();
			return;
		}

		if (this.panel === 'keys') {
			if (code === Controls.MOVE_UP) {
				this.index = (this.index - 1 + this.rows.length) % this.rows.length;
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.updateSelection();
			} else if (code === Controls.MOVE_DOWN) {
				this.index = (this.index + 1) % this.rows.length;
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.updateSelection();
			} else if (code === Controls.MOVE_RIGHT) {
				this.panel = 'sidebar';
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.updateSelection();
			} else if (code === Controls.MENU_SELECT) {
				this.waiting = true;
				SoundManager.play(SFX.UI_SELECT);
				this.updateSelection();
			}
		} else {
			if (code === Controls.MOVE_UP) {
				this.sidebarIndex =
					(this.sidebarIndex - 1 + SIDEBAR_ACTIONS.length) %
					SIDEBAR_ACTIONS.length;
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.updateSelection();
			} else if (code === Controls.MOVE_DOWN) {
				this.sidebarIndex = (this.sidebarIndex + 1) % SIDEBAR_ACTIONS.length;
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.updateSelection();
			} else if (code === Controls.MOVE_LEFT) {
				this.panel = 'keys';
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.updateSelection();
			} else if (code === Controls.MENU_SELECT) {
				this.confirmSidebar();
			}
		}
	}

	private updateSelection(): void {
		this.rows.forEach((row, i) => {
			const isActive = this.panel === 'keys' && i === this.index;
			row.classList.toggle('selected', isActive && !this.waiting);
			row.classList.toggle('waiting', isActive && this.waiting);
		});
		this.sidebarBtns.forEach((btn, i) => {
			btn.classList.toggle(
				'selected',
				this.panel === 'sidebar' && i === this.sidebarIndex
			);
		});
	}

	private confirmSidebar(): void {
		const action = SIDEBAR_ACTIONS[this.sidebarIndex];
		if (action === 'exit') {
			SoundManager.play(SFX.UI_SELECT);
			this.exit();
		} else {
			SoundManager.play(SFX.UI_SELECT);
			this.applyPreset(PRESETS[action]);
		}
	}

	private assignKey(code: string): void {
		const entry = CONTROL_MAP[this.index];
		if (!entry) return;
		Controls[entry.action] = code;
		if (this.valueSpans[this.index]) {
			this.valueSpans[this.index].textContent = codeToDisplay(code);
		}
	}

	private applyPreset(preset: Partial<typeof Controls>): void {
		CONTROL_MAP.forEach((entry, i) => {
			const code = preset[entry.action];
			if (code !== undefined) {
				Controls[entry.action] = code;
				if (this.valueSpans[i]) {
					this.valueSpans[i].textContent = codeToDisplay(code);
				}
			}
		});
	}

	private exit(): void {
		this.waiting = false;
		this.panel = 'keys';
		this.index = 0;
		this.sidebarIndex = 0;
		this.updateSelection();

		const currentUser = localStorage.getItem('loggedUser');
		if (currentUser) {
			SaveManager.saveSettings(currentUser);
		}

		const section = document.getElementById('keyconfig')!;
		if (section.classList.contains('outro')) return;
		section.classList.add('outro');
		setTimeout(() => this.sceneManager.switchTo(Scene.OPTIONS), 400);
	}
}
