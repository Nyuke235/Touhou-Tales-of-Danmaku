import { GameState } from '../game/GameState';
import { Controls, setControls } from './Controls';
import { MusicManager } from './MusicManager';
import { SoundManager } from './SoundManager';
import {
	BackendAPI,
	NormalizedSaveData,
	isTauri,
	invoke,
} from '../utils/BackendAPI';
import { ScoreEntry } from '../utils/User';

export class SaveManager {
	static saveSettings(username: string): void {
		if (!username) return;
		if (isTauri()) {
			this.tauriSaveAll(username);
			return;
		}
		BackendAPI.saveSettings(
			username,
			Controls as unknown as Record<string, string>,
			MusicManager.getVolume(),
			SoundManager.getVolume()
		);
	}

	static saveScore(username: string, entry: ScoreEntry): void {
		if (!username) return;
		if (isTauri()) {
			this.tauriSaveAll(username);
			return;
		}
		BackendAPI.saveScore(username, entry);
	}

	static loadData(data: NormalizedSaveData | null, username: string): void {
		if (!data) {
			this.saveSettings(username);
			return;
		}
		try {
			GameState.scores = data.scores;
			GameState.highScore =
				data.scores.length > 0
					? Math.max(
							0,
							...data.scores.filter(s => s.slow <= 5).map(s => s.score)
						)
					: 0;

			if (data.controls) setControls(data.controls as any);

			MusicManager.setVolume(data.music_vol);
			SoundManager.setVolume(data.sfx_vol);
		} catch (e) {
			console.error('Failed to apply save data.', e);
		}
	}

	private static tauriSaveAll(username: string): void {
		const saveData = {
			highscore: GameState.highScore,
			date: Date.now(),
			controls: Controls,
			volumes: {
				music: MusicManager.getVolume(),
				sfx: SoundManager.getVolume(),
			},
			scores: GameState.scores,
		};
		invoke('save_data', { username, saveData }).catch(e =>
			console.error('[Save]', e)
		);
	}
}
