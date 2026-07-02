import { SceneManager, Scene } from '../../systems/SceneManager';
import { InputManager } from '../../systems/InputManager';
import { Controls } from '../../systems/Controls';
import { MusicManager, Music } from '../../systems/MusicManager';
import { SoundManager, SFX } from '../../systems/SoundManager';
import { MenuScene } from './MenuScene';

interface TrackEntry {
	src: string;
	title: string;
	label: string;
}

//prettier-ignore
const TRACKS: TrackEntry[] = [
	{ src: Music.MENU,   title: 'A Dream More Scarlet Than Red',     label: 'Menu Theme' },
	{ src: Music.STAGE1, title: 'A Soul as Red as a Ground Cherry',  label: 'Stage 1 Theme' },
	{ src: Music.BOSS,   title: 'Apparitions Stalk the Night',       label: 'Stage 1 Boss Theme' },
	{ src: Music.STAGE2, title: 'Lunate Elf',                        label: 'Stage 2 Theme' },
	{ src: Music.BOSS2,  title: 'Tomboyish Girl in Love',            label: 'Stage 2 Boss Theme' },
	{ src: Music.STAGE3, title: 'Deaf to All But the Song',          label: 'Stage 3 Theme' },
	{ src: Music.BOSS3,  title: 'Shanghai Teahouse',                 label: 'Stage 3 Boss Theme' },
	{ src: Music.ENDING, title: 'Crimson Belvedere ~ Eastern Dream', label: 'Ending Theme' },
];

export class MusicRoomScene extends MenuScene {
	private selectedIndex: number = 0;
	private items: HTMLElement[] = [];

	private trackNoEl: HTMLElement;
	private trackTitleEl: HTMLElement;
	private trackLabelEl: HTMLElement;

	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.MUSIC_ROOM);
		this.trackNoEl = document.getElementById('mr-track-no')!;
		this.trackTitleEl = document.getElementById('mr-track-title')!;
		this.trackLabelEl = document.getElementById('mr-track-label')!;

		this.buildList();
		this.updateSelection();
	}

	onEnter(): void {
		this.updateSelection();
		MusicManager.play(TRACKS[this.selectedIndex].src);
	}

	protected onKeyDown(code: string): void {
		if (code === Controls.MOVE_UP) {
			this.selectedIndex =
				(this.selectedIndex - 1 + TRACKS.length) % TRACKS.length;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.updateSelection();
			MusicManager.play(TRACKS[this.selectedIndex].src);
		}
		if (code === Controls.MOVE_DOWN) {
			this.selectedIndex = (this.selectedIndex + 1) % TRACKS.length;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.updateSelection();
			MusicManager.play(TRACKS[this.selectedIndex].src);
		}
		if (code === Controls.BACK) {
			this.sceneManager.switchTo(Scene.HOME);
		}
	}

	private buildList(): void {
		const list = document.getElementById('mr-track-list')!;
		TRACKS.forEach((track, i) => {
			const li = document.createElement('li');
			li.className = 'mr-track-item';

			const noEl = document.createElement('span');
			noEl.className = 'mr-item-no';
			noEl.textContent = String(i + 1).padStart(2, '0');

			const nameEl = document.createElement('span');
			nameEl.className = 'mr-item-name';
			nameEl.textContent = track.title;

			li.appendChild(noEl);
			li.appendChild(nameEl);
			list.appendChild(li);
			this.items.push(li);
		});
	}

	private updateSelection(): void {
		this.items.forEach((item, i) =>
			item.classList.toggle('selected', i === this.selectedIndex)
		);
		this.items[this.selectedIndex]?.scrollIntoView({ block: 'nearest' });

		const track = TRACKS[this.selectedIndex];
		this.trackNoEl.textContent = `No. ${String(this.selectedIndex + 1).padStart(2, '0')}`;
		this.trackTitleEl.textContent = track.title;
		this.trackLabelEl.textContent = track.label;
	}
}
