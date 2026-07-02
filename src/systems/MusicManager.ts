import { AUDIO } from '../game/Constants';
import { isTauri, invoke } from '../utils/BackendAPI';

export const Music = {
	MENU: 'assets/audio/music/menu/a_dream_that_is_more_scarlet_than_red.ogg',
	STAGE1: 'assets/audio/music/stage1/a_soul_as_red_as_a_ground_cherry.ogg',
	BOSS: 'assets/audio/music/stage1/apparitions_stalk_the_night.ogg',
	STAGE2: 'assets/audio/music/stage2/lunate_elf.ogg',
	BOSS2: 'assets/audio/music/stage2/tomboyish_girl_in_love.ogg',
	STAGE3: 'assets/audio/music/stage3/deaf_to_all_but_the_song.ogg',
	BOSS3: 'assets/audio/music/stage3/shanghai_teahouse.ogg',
	ENDING: 'assets/audio/music/menu/crimson_belvedere_eastern_dream.ogg',
} as const;

export class MusicManager {
	private static volume: number = AUDIO.MUSIC_VOLUME;
	private static currentSrc: string = '';

	// WEB AUDIO (BROWSER)
	private static ctx: AudioContext | null = null;
	private static audio: HTMLAudioElement | null = null;
	private static sourceNode: MediaElementAudioSourceNode | null = null;
	private static gainNode: GainNode | null = null;

	private static getCtx(): AudioContext {
		if (!this.ctx) {
			this.ctx = new AudioContext();
			this.gainNode = this.ctx.createGain();
			this.gainNode.gain.value = this.volume;
			this.gainNode.connect(this.ctx.destination);
		}
		return this.ctx;
	}

	// PUBLIC API

	static play(src: string): void {
		if (this.currentSrc === src) return;
		this.currentSrc = src;

		if (isTauri()) {
			invoke('play_music', { src }).catch(e => console.error('[Music]', e));
			return;
		}

		if (this.audio) {
			this.audio.pause();
			this.audio.currentTime = 0;
			this.sourceNode?.disconnect();
			this.sourceNode = null;
		}

		const ctx = this.getCtx();
		const audio = new Audio(src);
		audio.loop = true;
		audio.crossOrigin = 'anonymous';
		const source = ctx.createMediaElementSource(audio);
		source.connect(this.gainNode!);
		this.audio = audio;
		this.sourceNode = source;

		const tryPlay = () => {
			if (ctx.state === 'suspended') ctx.resume();
			audio.play().catch(err => console.warn('[Music]', err));
		};

		if (ctx.state === 'running') {
			tryPlay();
		} else {
			const unlock = () => {
				tryPlay();
				document.removeEventListener('keydown', unlock);
			};
			document.addEventListener('keydown', unlock);
		}
	}

	static stop(): void {
		this.currentSrc = '';
		if (isTauri()) {
			invoke('stop_music').catch(e => console.error('[Music]', e));
			return;
		}
		if (this.audio) {
			this.audio.pause();
			this.audio.currentTime = 0;
			this.sourceNode?.disconnect();
			this.audio = null;
			this.sourceNode = null;
		}
	}

	static pause(): void {
		if (isTauri()) {
			invoke('pause_music').catch(e => console.error('[Music]', e));
			return;
		}
		this.audio?.pause();
		this.ctx?.suspend();
	}

	static resume(): void {
		if (isTauri()) {
			invoke('resume_music').catch(e => console.error('[Music]', e));
			return;
		}
		if (this.ctx?.state === 'suspended') this.ctx.resume();
		this.audio?.play().catch(err => console.warn('[Music]', err));
	}

	static setVolume(volume: number): void {
		this.volume = Math.max(0, Math.min(1, volume));
		if (isTauri()) {
			invoke('set_music_volume', { volume: this.volume }).catch(e =>
				console.error('[Music]', e)
			);
			return;
		}
		if (this.gainNode) this.gainNode.gain.value = this.volume;
	}

	static getVolume(): number {
		return this.volume;
	}
}
