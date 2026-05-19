import { SceneManager, Scene } from '../../systems/SceneManager';
import { InputManager } from '../../systems/InputManager';
import { LocalScores, ScoreEntry } from '../../systems/LocalScores';
import { BackendAPI } from '../../utils/BackendAPI';
import { SoundManager, SFX } from '../../systems/SoundManager';
import { LeaderboardManagement } from '../../systems/LeaderboardManager';

const MIN_LEN = 3;
const MAX_LEN = 12;
const NAME_KEY = 'lastSubmitName';
const VALID_CHAR = /^[a-zA-Z0-9_-]$/;

export class SaveScoreScene {
	private static pending: ScoreEntry | null = null;

	static setPending(entry: ScoreEntry): void {
		this.pending = entry;
	}

	private sceneManager: SceneManager;
	private name: string = '';
	private submitting: boolean = false;
	private nameEl: HTMLElement;
	private statusEl: HTMLElement;

	constructor(sceneManager: SceneManager, _inputManager: InputManager) {
		this.sceneManager = sceneManager;
		this.nameEl = document.getElementById('ss-name')!;
		this.statusEl = document.getElementById('ss-status')!;

		window.addEventListener('keydown', e => this.onKeyDown(e));

		const section = document.getElementById('save-score')!;
		const observer = new MutationObserver(() => {
			if (section.style.display !== 'none' && !this.submitting) {
				this.refresh();
			}
		});
		observer.observe(section, { attributes: true, attributeFilter: ['style'] });
	}

	private refresh(): void {
		this.name = localStorage.getItem(NAME_KEY) ?? '';
		this.submitting = false;
		this.setStatus('');
		this.populate();
		this.render();
	}

	private populate(): void {
		const entry = SaveScoreScene.pending;
		document.getElementById('ss-score')!.textContent = (entry?.score ?? 0)
			.toString()
			.padStart(11, '0');
		document.getElementById('ss-stage')!.textContent = entry
			? entry.stage.toString()
			: '-';
		document.getElementById('ss-slow')!.textContent = entry
			? `${entry.slow.toFixed(1)}%`
			: '0.0%';
	}

	private onKeyDown(e: KeyboardEvent): void {
		if (this.sceneManager.getCurrentScene() !== Scene.SAVE_SCORE) return;
		if (this.submitting) return;

		if (e.key === 'Escape') {
			e.preventDefault();
			SoundManager.play(SFX.UI_SELECT);
			this.exitToHome();
			return;
		}
		if (e.key === 'Enter') {
			e.preventDefault();
			this.submit();
			return;
		}
		if (e.key === 'Backspace') {
			e.preventDefault();
			if (this.name.length > 0) {
				this.name = this.name.slice(0, -1);
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.render();
			}
			return;
		}
		if (e.key.length === 1 && VALID_CHAR.test(e.key) && this.name.length < MAX_LEN) {
			e.preventDefault();
			this.name += e.key;
			SoundManager.play(SFX.LETTER);
			this.render();
		}
	}

	private render(): void {
		this.nameEl.textContent = this.name;
	}

	private setStatus(text: string, kind: '' | 'ok' | 'err' = ''): void {
		this.statusEl.textContent = text;
		this.statusEl.classList.remove('ok', 'err');
		if (kind) this.statusEl.classList.add(kind);
	}

	private async submit(): Promise<void> {
		const entry = SaveScoreScene.pending;
		if (!entry) {
			this.exitToHome();
			return;
		}
		if (this.name.length < MIN_LEN) {
			this.setStatus(`NAME MUST BE AT LEAST ${MIN_LEN} CHARACTERS`, 'err');
			return;
		}

		this.submitting = true;
		this.setStatus('SAVING...', '');
		SoundManager.play(SFX.UI_SELECT);

		const result = await BackendAPI.saveScore(this.name, entry);

		if (result.ok) {
			localStorage.setItem(NAME_KEY, this.name);
			LocalScores.tagByDate(entry.date, this.name);
			this.setStatus('SAVED!', 'ok');
			SaveScoreScene.pending = null;
			await LeaderboardManagement.generateLeaderboard();
			setTimeout(() => this.exitToHome(), 700);
		} else {
			this.submitting = false;
			this.setStatus(result.message ?? 'SAVE FAILED', 'err');
		}
	}

	private exitToHome(): void {
		const section = document.getElementById('save-score')!;
		if (section.classList.contains('outro')) return;
		section.classList.add('outro');
		setTimeout(() => this.sceneManager.switchTo(Scene.HOME), 400);
	}
}
