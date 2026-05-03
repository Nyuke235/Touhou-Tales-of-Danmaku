export class InputManager {
	private keysDown: Set<string> = new Set();
	justSwitched: boolean = false;
	private keyDownListeners: ((e: KeyboardEvent) => void)[] = [];
	private enabled: boolean = false;

	constructor() {
		window.addEventListener('keydown', e => {
			this.keysDown.add(e.code);
			if (
				['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)
			) {
				e.preventDefault();
			}
		});
		window.addEventListener('keyup', e => this.keysDown.delete(e.code));
	}

	isHeld(key: string): boolean {
		return this.keysDown.has(key);
	}

	enable(): void {
		this.enabled = true;
	}

	onKeyDown(callback: (code: string) => void): void {
		const listener = (e: KeyboardEvent) => {
			if (!this.enabled) return;
			callback(e.code);
		};
		this.keyDownListeners.push(listener);
		window.addEventListener('keydown', listener);
	}

	removeKeyDownListeners(): void {
		for (const listener of this.keyDownListeners) {
			window.removeEventListener('keydown', listener);
		}
		this.keyDownListeners = [];
	}
}
