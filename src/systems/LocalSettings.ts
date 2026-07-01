import { AUDIO } from '../game/Constants';
import { GameState } from '../game/GameState';
import { Controls, setControls } from './Controls';
import { MusicManager } from './MusicManager';
import { SoundManager } from './SoundManager';

const STORAGE_KEY = 'gameSettings';

interface StoredSettings {
	controls?: Partial<typeof Controls>;
	music_vol?: number;
	sfx_vol?: number;
	low_details?: boolean;
}

function read(): StoredSettings {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as StoredSettings) : {};
	} catch {
		return {};
	}
}

function clamp01(n: unknown, fallback: number): number {
	return typeof n === 'number' && isFinite(n)
		? Math.max(0, Math.min(1, n))
		: fallback;
}

export const LocalSettings = {
	load(): void {
		const data = read();

		if (data.controls && typeof data.controls === 'object') {
			setControls({ ...Controls, ...data.controls });
		}

		MusicManager.setVolume(clamp01(data.music_vol, AUDIO.MUSIC_VOLUME));
		SoundManager.setVolume(clamp01(data.sfx_vol, AUDIO.SFX_VOLUME));

		if (typeof data.low_details === 'boolean') {
			GameState.lowDetails = data.low_details;
		}
	},

	save(): void {
		const payload: StoredSettings = {
			controls: { ...Controls },
			music_vol: MusicManager.getVolume(),
			sfx_vol: SoundManager.getVolume(),
			low_details: GameState.lowDetails,
		};
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
		} catch (e) {
			console.error('[LocalSettings] save failed', e);
		}
	},
};
