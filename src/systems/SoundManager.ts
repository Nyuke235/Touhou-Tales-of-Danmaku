import { AUDIO } from '../game/Constants';
import { isTauri, invoke } from '../utils/BackendAPI';

export const SFX = {
	PLAYER_DEATH: 'assets/audio/sfx/player/death.wav',
	PLAYER_1UP: 'assets/audio/sfx/player/powerup.wav',
	PLAYER_SHOOT: 'assets/audio/sfx/player/shoot.wav',
	PLAYER_BOMBLIFE: 'assets/audio/sfx/player/bomblife.wav',
	PLAYER_ITEM: 'assets/audio/sfx/player/item.wav',
	PLAYER_BOMB: 'assets/audio/sfx/player/bombusage.wav',
	PLAYER_SEAL: 'assets/audio/sfx/player/seal.wav',
	PLAYER_MASTERSPARK: 'assets/audio/sfx/player/masterspark.wav',
	PLAYER_GRAZE: 'assets/audio/sfx/player/graze.wav',

	MANDRAGORA_SCREAM: 'assets/audio/sfx/enemies/mandragora.wav',
	CANNON_FIRE: 'assets/audio/sfx/enemies/cannon.wav',
	CANNONBALL_EXPLODE: 'assets/audio/sfx/enemies/cannonball.wav',
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

	// Web Audio (browser)
	private static ctx: AudioContext | null = null;
	private static buffers = new Map<string, AudioBuffer>();
	private static ambientNodes = new Map<
		string,
		{ source: AudioBufferSourceNode; gain: GainNode }
	>();

	private static getCtx(): AudioContext {
		if (!this.ctx) this.ctx = new AudioContext();
		return this.ctx;
	}

	private static async loadBuffer(src: string): Promise<AudioBuffer | null> {
		if (this.buffers.has(src)) return this.buffers.get(src)!;
		try {
			const ab = await fetch(src).then(r => r.arrayBuffer());
			const buf = await this.getCtx().decodeAudioData(ab);
			this.buffers.set(src, buf);
			return buf;
		} catch (e) {
			console.warn('[SFX load]', src, e);
			return null;
		}
	}

	// Public API

	static play(src: string): void {
		if (isTauri()) {
			invoke('play_sfx', { src }).catch(e => console.error('[SFX]', src, e));
			return;
		}
		this.loadBuffer(src).then(buf => {
			if (!buf) return;
			const ctx = this.getCtx();
			if (ctx.state === 'suspended') ctx.resume();
			const gain = ctx.createGain();
			gain.gain.value = this.volume;
			gain.connect(ctx.destination);
			const source = ctx.createBufferSource();
			source.buffer = buf;
			source.connect(gain);
			source.start();
		});
	}

	static playAmbient(src: string, relativeVolume: number = 1.0): void {
		if (isTauri()) {
			invoke('play_sfx', { src }).catch(e => console.error('[SFX]', src, e));
			return;
		}
		if (this.ambientNodes.has(src)) return;
		this.loadBuffer(src).then(buf => {
			if (!buf) return;
			const ctx = this.getCtx();
			if (ctx.state === 'suspended') ctx.resume();
			const gain = ctx.createGain();
			gain.gain.value = this.volume * relativeVolume;
			gain.connect(ctx.destination);
			const source = ctx.createBufferSource();
			source.buffer = buf;
			source.loop = true;
			source.connect(gain);
			source.start();
			this.ambientNodes.set(src, { source, gain });
		});
	}

	static stopAmbient(src: string): void {
		const node = this.ambientNodes.get(src);
		if (!node) return;
		node.source.stop();
		this.ambientNodes.delete(src);
	}

	static setVolume(volume: number): void {
		this.volume = Math.max(0, Math.min(1, volume));
		if (isTauri()) {
			invoke('set_sfx_volume', { volume: this.volume }).catch(() => {});
			return;
		}
		this.ambientNodes.forEach(({ gain }) => {
			gain.gain.value = this.volume;
		});
	}

	static getVolume(): number {
		return this.volume;
	}
}
