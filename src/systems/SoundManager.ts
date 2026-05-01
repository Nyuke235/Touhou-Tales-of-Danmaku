import { AUDIO } from '../game/Constants';

export const SFX = {
	PLAYER_DEATH: 'assets/audio/sfx/player/death.wav',
	PLAYER_1UP: 'assets/audio/sfx/player/powerup.wav',
	PLAYER_SHOOT: 'assets/audio/sfx/player/shoot.wav',
	PLAYER_BOMBLIFE: 'assets/audio/sfx/player/bomblife.wav',
	PLAYER_ITEM: 'assets/audio/sfx/player/item.wav',
	PLAYER_BOMB: 'assets/audio/sfx/player/bombusage.wav',
	PLAYER_GRAZE: 'assets/audio/sfx/player/graze.wav',

	ENEMY_HIT: 'assets/audio/sfx/enemies/hit.wav',
	ENEMY_DEATH: 'assets/audio/sfx/enemies/destruction.wav',
	ENEMY_SHOT: 'assets/audio/sfx/enemies/enemyshot.wav',
	BOSS_SHOT: 'assets/audio/sfx/enemies/bossshot.wav',
	BOSS_CHARGE: 'assets/audio/sfx/enemies/charge.wav',
	BOSS_DEFEATED: 'assets/audio/sfx/enemies/bossdefeated.wav',
	PHASE_DEFEATED: 'assets/audio/sfx/enemies/phasedefeated.wav',
	SPELLCARD: 'assets/audio/sfx/enemies/spellcard.wav',
	LASER: 'assets/audio/sfx/enemies/laser.wav',
	TIMEOUT: 'assets/audio/sfx/enemies/timeout.wav',
	BLIZZARD: 'assets/audio/sfx/ambient/blizzard.wav',

	UI_HIGHLIGHT: 'assets/audio/sfx/ui/highlight.wav',
	UI_SELECT: 'assets/audio/sfx/ui/select.wav',
	UI_PAUSE: 'assets/audio/sfx/ui/pause.wav',
	GAME_OVER: 'assets/audio/sfx/ui/gameover.wav',
	LETTER: 'assets/audio/sfx/ui/letter.wav',
	SKIP: 'assets/audio/sfx/ui/skip.wav',
} as const;

export type SFXKey = keyof typeof SFX;

export class SoundManager {
	private static volume: number = AUDIO.SFX_VOLUME;
	private static pools: Map<string, HTMLAudioElement[]> = new Map();
	private static poolIndex: Map<string, number> = new Map();
	private static ambients: Map<string, HTMLAudioElement> = new Map();

	private static getNext(src: string): HTMLAudioElement {
		if (!this.pools.has(src)) {
			const pool = Array.from({ length: AUDIO.POOL_SIZE }, () => {
				const a = new Audio(src);
				a.volume = this.volume;
				return a;
			});
			this.pools.set(src, pool);
			this.poolIndex.set(src, 0);
		}

		const pool = this.pools.get(src)!;
		const idx = this.poolIndex.get(src)!;
		this.poolIndex.set(src, (idx + 1) % AUDIO.POOL_SIZE);
		return pool[idx];
	}

	static play(src: string): void {
		const audio = this.getNext(src);
		audio.currentTime = 0;
		audio.play().catch(err => console.warn('[SFX]', err));
	}

	static playAmbient(src: string, relativeVolume: number = 1.0): void {
		if (this.ambients.has(src)) return;
		const a = new Audio(src);
		a.loop = true;
		a.volume = this.volume * relativeVolume;
		a.play().catch(err => console.warn('[SFX ambient]', err));
		this.ambients.set(src, a);
	}

	static stopAmbient(src: string): void {
		const a = this.ambients.get(src);
		if (!a) return;
		a.pause();
		a.currentTime = 0;
		this.ambients.delete(src);
	}

	static setVolume(volume: number): void {
		this.volume = Math.max(0, Math.min(1, volume));
		this.pools.forEach(pool => pool.forEach(a => (a.volume = this.volume)));
	}

	static getVolume(): number {
		return this.volume;
	}
}
