export class SpellcardBackground {
	private img: HTMLImageElement;
	private loaded = false;

	private alpha = 0;
	private fadingIn = false;
	private fadingOut = false;
	private active = false;

	private flashAlpha = 0;

	private angle1 = 0;
	private angle2 = 0;

	private static FADE_SPEED = 1.8;
	private static ROT_SPEED_1 = 0.22;
	private static ROT_SPEED_2 = -0.38;
	private static FLASH_DECAY = 3.0;

	private static readonly DEFAULT_SRC =
		'assets/sprites/backgrounds/stage1_spellcard.png';

	constructor() {
		this.img = new Image();
		this.img.onload = () => (this.loaded = true);
		this.img.src = SpellcardBackground.DEFAULT_SRC;
	}

	show(src?: string): void {
		const nextSrc = src ?? SpellcardBackground.DEFAULT_SRC;
		if (!this.img.src.endsWith(nextSrc)) {
			this.loaded = false;
			this.img = new Image();
			this.img.onload = () => (this.loaded = true);
			this.img.src = nextSrc;
		}
		this.active = true;
		this.fadingIn = true;
		this.fadingOut = false;
		this.flashAlpha = 0.7;
	}

	hide(): void {
		if (!this.active && this.alpha === 0) return;
		this.fadingOut = true;
		this.fadingIn = false;
	}

	reset(): void {
		this.alpha = 0;
		this.active = false;
		this.fadingIn = false;
		this.fadingOut = false;
		this.flashAlpha = 0;
		this.angle1 = 0;
		this.angle2 = 0;
	}

	isActive(): boolean {
		return this.active || this.alpha > 0;
	}

	update(dt: number): void {
		if (this.flashAlpha > 0) {
			this.flashAlpha = Math.max(
				0,
				this.flashAlpha - SpellcardBackground.FLASH_DECAY * dt
			);
		}

		if (!this.active && this.alpha === 0) return;

		this.angle1 += SpellcardBackground.ROT_SPEED_1 * dt;
		this.angle2 += SpellcardBackground.ROT_SPEED_2 * dt;

		if (this.fadingIn) {
			this.alpha = Math.min(
				1,
				this.alpha + SpellcardBackground.FADE_SPEED * dt
			);
			if (this.alpha >= 1) {
				this.alpha = 1;
				this.fadingIn = false;
			}
		} else if (this.fadingOut) {
			this.alpha = Math.max(
				0,
				this.alpha - SpellcardBackground.FADE_SPEED * dt
			);
			if (this.alpha <= 0) {
				this.alpha = 0;
				this.fadingOut = false;
				this.active = false;
			}
		}
	}

	render(ctx: CanvasRenderingContext2D, width: number, height: number): void {
		if (!this.loaded) return;
		if (this.alpha <= 0 && this.flashAlpha <= 0) return;

		const cx = width / 2;
		const cy = height / 2;

		const size = Math.hypot(width, height) * 1.15;

		ctx.save();

		ctx.beginPath();
		ctx.rect(0, 0, width, height);
		ctx.clip();

		if (this.alpha > 0) {
			ctx.save();
			ctx.globalAlpha = this.alpha;
			ctx.translate(cx, cy);
			ctx.rotate(this.angle1);
			ctx.drawImage(this.img, -size / 2, -size / 2, size, size);
			ctx.restore();

			ctx.save();
			ctx.globalAlpha = this.alpha * 0.55;
			ctx.translate(cx, cy);
			ctx.rotate(this.angle2);
			ctx.drawImage(this.img, -size / 2, -size / 2, size, size);
			ctx.restore();

			const vignette = ctx.createRadialGradient(
				cx,
				cy,
				size * 0.08,
				cx,
				cy,
				size * 0.52
			);
			vignette.addColorStop(0, 'rgba(0,0,0,0)');
			vignette.addColorStop(1, `rgba(0,0,0,${(this.alpha * 0.4).toFixed(3)})`);
			ctx.save();
			ctx.globalAlpha = 1;
			ctx.fillStyle = vignette;
			ctx.fillRect(0, 0, width, height);
			ctx.restore();
		}

		if (this.flashAlpha > 0) {
			ctx.save();
			ctx.globalAlpha = this.flashAlpha;
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, width, height);
			ctx.restore();
		}

		ctx.restore();
	}
}
