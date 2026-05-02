import { AUDIO } from '../game/Constants';

export const Music = {
	MENU: 'assets/audio/music/menu/a_dream_that_is_more_scarlet_than_red.ogg',
	STAGE1: 'assets/audio/music/stage1/a_soul_as_red_as_a_ground_cherry.ogg',
	BOSS: 'assets/audio/music/stage1/apparitions_stalk_the_night.ogg',
	STAGE2: 'assets/audio/music/stage2/lunate_elf.ogg',
	BOSS2: 'assets/audio/music/stage2/tomboyish_girl_in_love.ogg',
	STAGE3: 'assets/audio/music/stage3/deaf_to_all_but_the_song.ogg',
	BOSS3: 'assets/audio/music/stage3/shanghai_teahouse.ogg',
} as const;

export class MusicManager {
	private static audio: HTMLAudioElement | null = null;
	private static currentSrc: string = '';
	private static volume: number = AUDIO.MUSIC_VOLUME;

	static play(src: string): void {
		if (this.currentSrc === src) return;

		if (this.audio) {
			this.audio.pause();
			this.audio.currentTime = 0;
		}

		this.audio = new Audio(src);
		this.audio.loop = true;
		this.audio.volume = this.volume;
		this.currentSrc = src;
		this.audio.play().catch(err => console.warn('[Music]', err));
	}

	static stop(): void {
		if (!this.audio) return;
		this.audio.pause();
		this.audio.currentTime = 0;
		this.audio = null;
		this.currentSrc = '';
	}

	static pause(): void {
		if (this.audio) this.audio.pause();
	}

	static resume(): void {
		if (this.audio)
			this.audio.play().catch(err => console.warn('[Music]', err));
	}

	static setVolume(volume: number): void {
		this.volume = Math.max(0, Math.min(1, volume));
		if (this.audio) this.audio.volume = this.volume;
	}

	static getVolume(): number {
		return this.volume;
	}
}
