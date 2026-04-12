import { SceneManager, Scene } from '../systems/SceneManager';
import { InputManager } from '../systems/InputManager';
import { Controls } from '../systems/Controls';
import { GameState, Character } from '../game/GameState';
import { SoundManager, SFX } from '../systems/SoundManager';
import { loadCharacters, CharacterData } from '../characters/Characters';
import { Spritesheet } from '../utils/Spritesheet';
import { MenuScene } from './MenuScene';

interface ColorOption {
	id: string;
	css: string;
}

const CHARACTER_COLORS: { [id: string]: ColorOption[] } = {
	reimu: [
		{ id: 'default', css: '#cc2222' },
		{ id: 'blue', css: '#4488ee' },
		{ id: 'green', css: '#44aa44' },
	],
	marisa: [
		{ id: 'default', css: '#1a1a1a' },
		{ id: 'green', css: '#44aa44' },
		{ id: 'purple', css: '#9944cc' },
	],
};

export class CharacterScene extends MenuScene {
	private characterIndex: number = 0;
	private colorIndex: number = 0;
	private backScene: Scene = Scene.DIFFICULTY;
	private onConfirm: (() => void) | null = null;

	setContext(backScene: Scene, onConfirm?: () => void): void {
		this.backScene = backScene;
		this.onConfirm = onConfirm ?? null;
	}

	private charName: HTMLElement;
	private charTitle: HTMLElement;
	private charSpeed: HTMLElement;
	private charShot: HTMLElement;
	private charSpellcard: HTMLElement;
	private charCounter: HTMLElement;
	private charColors: HTMLElement;

	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private activeSpritesheet: Spritesheet | null = null;
	private lastTime: number = 0;

	private characters: CharacterData[] = [];

	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		super(sceneManager, inputManager, Scene.CHARACTERS);
		this.charName = document.getElementById('char-name')!;
		this.charTitle = document.getElementById('char-title')!;
		this.charSpeed = document.getElementById('char-speed')!;
		this.charShot = document.getElementById('char-shot')!;
		this.charSpellcard = document.getElementById('char-spellcard')!;
		this.charCounter = document.getElementById('char-counter')!;
		this.charColors = document.getElementById('char-colors')!;

		this.canvas = document.getElementById('char-sprite') as HTMLCanvasElement;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

		this.ctx.imageSmoothingEnabled = false;

		loadCharacters().then(data => {
			this.characters = data;
			this.update();
			this.lastTime = performance.now();
			this.renderLoop();
		});

		this.update();
		this.bindMouse();
	}

	protected onKeyDown(code: string): void {
		if (code === Controls.MOVE_LEFT) {
			this.characterIndex =
				(this.characterIndex - 1 + this.characters.length) %
				this.characters.length;
			this.colorIndex = 0;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.update();
		}
		if (code === Controls.MOVE_RIGHT) {
			this.characterIndex = (this.characterIndex + 1) % this.characters.length;
			this.colorIndex = 0;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.update();
		}
		if (code === Controls.MOVE_UP || code === Controls.MOVE_DOWN) {
			const colors = this.currentColors();
			const dir = code === Controls.MOVE_UP ? -1 : 1;
			this.colorIndex = (this.colorIndex + dir + colors.length) % colors.length;
			SoundManager.play(SFX.UI_HIGHLIGHT);
			this.update();
		}
		if (code === Controls.MENU_SELECT) {
			this.confirm();
		}
		if (code === Controls.BACK) {
			const target = this.backScene;
			this.resetContext();
			this.switchWithOutro(target);
		}
	}

	private bindMouse(): void {
		document
			.querySelector('#characters .arrow-left')!
			.addEventListener('click', () => {
				if (this.sceneManager.getCurrentScene() !== Scene.CHARACTERS) return;
				this.characterIndex =
					(this.characterIndex - 1 + this.characters.length) %
					this.characters.length;
				this.colorIndex = 0;
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.update();
			});
		document
			.querySelector('#characters .arrow-right')!
			.addEventListener('click', () => {
				if (this.sceneManager.getCurrentScene() !== Scene.CHARACTERS) return;
				this.characterIndex =
					(this.characterIndex + 1) % this.characters.length;
				this.colorIndex = 0;
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.update();
			});
	}

	private currentColors(): ColorOption[] {
		if (this.characters.length === 0) return [];
		const id = this.characters[this.characterIndex].id;
		return CHARACTER_COLORS[id] ?? [{ id: 'default', css: '#888' }];
	}

	private update(): void {
		if (this.characters.length === 0) return;

		const char: CharacterData = this.characters[this.characterIndex];
		const colors = this.currentColors();
		const selectedColor = colors[this.colorIndex] ?? colors[0];

		this.charName.textContent = char.name;
		this.charTitle.textContent = char.title;
		this.charSpeed.textContent = char.speed;
		this.charShot.textContent = char.shot;
		this.charSpellcard.textContent = char.spellcardFull;
		this.charCounter.textContent = `${this.characterIndex + 1} / ${this.characters.length}`;

		GameState.character = char.id as Character;
		GameState.characterColor = selectedColor.id;

		const spriteSrc =
			selectedColor.id === 'default'
				? char.sprite[1]
				: char.sprite[1].replace(
						'_spritesheet.png',
						`_${selectedColor.id}_spritesheet.png`
					);

		this.activeSpritesheet = new Spritesheet({
			src: spriteSrc,
			frameX: 104,
			frameY: 104,
			frameCount: 10,
			frameSpeed: 75,
		});

		this.renderColorDots(colors, this.colorIndex);
	}

	private renderColorDots(colors: ColorOption[], selected: number): void {
		this.charColors.innerHTML = '';
		colors.forEach((c, i) => {
			const dot = document.createElement('span');
			dot.className = 'color-dot' + (i === selected ? ' selected' : '');
			dot.style.background = c.css;
			dot.addEventListener('click', () => {
				if (this.sceneManager.getCurrentScene() !== Scene.CHARACTERS) return;
				this.colorIndex = i;
				SoundManager.play(SFX.UI_HIGHLIGHT);
				this.update();
			});
			this.charColors.appendChild(dot);
		});
	}

	private renderLoop = (time: number = 0): void => {
		const dt = time - this.lastTime;
		this.lastTime = time;

		if (this.sceneManager.getCurrentScene() === Scene.CHARACTERS) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			if (this.activeSpritesheet) {
				this.activeSpritesheet.update(dt);
				this.activeSpritesheet.draw(
					this.ctx,
					0,
					0,
					this.canvas.width,
					this.canvas.height
				);
			}
		}

		requestAnimationFrame(this.renderLoop);
	};

	private switchWithOutro(target: Scene): void {
		const section = document.getElementById('characters')!;
		if (section.classList.contains('outro')) return;
		section.classList.add('outro');
		setTimeout(() => this.sceneManager.switchTo(target), 400);
	}

	private resetContext(): void {
		this.backScene = Scene.DIFFICULTY;
		this.onConfirm = null;
	}

	private confirm(): void {
		SoundManager.play(SFX.UI_SELECT);
		GameState.character = this.characters[this.characterIndex].id as Character;
		GameState.characterColor =
			this.currentColors()[this.colorIndex]?.id ?? 'default';
		const callback = this.onConfirm;
		this.resetContext();
		if (callback) {
			callback();
		} else {
			this.switchWithOutro(Scene.GAME);
		}
	}
}
