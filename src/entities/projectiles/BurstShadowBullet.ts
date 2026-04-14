import { BaseProjectile } from '../Projectile';

const MAX_SIZE = 128;
const MIN_SIZE = 12;
const EXPAND_DURATION = 4.5;
const HOLD_DURATION = 1;
const FADE_DURATION = 1.5;

const IMG: HTMLImageElement = (() => {
	const img = new Image();
	img.src = 'assets/sprites/projectiles/hostile/shadowbullet.png';
	return img;
})();

export class BurstShadowBullet extends BaseProjectile {
	readonly isShadow = true;
	readonly damage = 0;

	private life: number = 0;
	private holding: boolean = false;
	private holdTimer: number = 0;
	private fading: boolean = false;
	private fadeTimer: number = 0;

	constructor(x: number, y: number, vx: number, vy: number) {
		super(x, y, vx, vy, MAX_SIZE, MAX_SIZE);
		this.hitRadius = 0;
	}

	override update(dt: number): void {
		if (this.fading) {
			this.life += dt;
			this.x += this.vx * dt;
			this.y += this.vy * dt;
			this.fadeTimer += dt;
			if (this.fadeTimer >= FADE_DURATION) this.active = false;
			return;
		}

		if (this.holding) {
			this.life += dt;
			this.x += this.vx * dt;
			this.y += this.vy * dt;
			this.holdTimer += dt;
			if (this.holdTimer >= HOLD_DURATION) {
				this.holding = false;
				this.fading = true;
				this.fadeTimer = 0;
			}
			return;
		}

		this.life += dt;
		super.update(dt);

		if (!this.active) {
			this.active = true;
			this.holding = true;
			this.holdTimer = 0;
		}
	}

	render(ctx: CanvasRenderingContext2D): void {
		const t = Math.min(1, this.life / EXPAND_DURATION);
		const size = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * t;

		ctx.save();
		if (this.fading) {
			ctx.globalAlpha = 1.0 - this.fadeTimer / FADE_DURATION;
		}
		ctx.drawImage(IMG, this.x - size / 2, this.y - size / 2, size, size);
		ctx.restore();
	}
}
