import { GameState } from '../game/GameState';
import { Controls, setControls } from './Controls';
import { MusicManager } from './MusicManager';
import { SoundManager } from './SoundManager';
import { BackendAPI } from '../utils/BackendAPI';
import { GameUserData } from '../utils/User';

export class SaveManager {
	static save(username: string) {
		if (!username) return;

		const data: GameUserData = {
			highscore: GameState.highScore,
			date: GameState.date,
			controls: Controls,
			volumes: {
				music: MusicManager.getVolume(),
				sfx: SoundManager.getVolume(),
			},
		};

		BackendAPI.save(username, data);
	}

	static loadData(data: any, username: string) {
		if (!data) {
			this.initNewPlayer(username);
			return;
		}

		try {
			GameState.highScore = data.highscore || 0;

			if (data.controls) {
				setControls(data.controls);
			}

			if (data.volumes) {
				MusicManager.setVolume(data.volumes.music ?? 0.7);
				SoundManager.setVolume(data.volumes.sfx ?? 0.8);
			}
		} catch (e) {
			console.error('Failed to apply save data.', e);
		}
	}

	static initNewPlayer(username: string) {
		this.save(username);
	}
}
