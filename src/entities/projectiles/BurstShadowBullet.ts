import { BaseProjectile } from '../Projectile';

const MAX_SIZE = 48;
const MIN_SIZE = 4;
const EXPAND_DURATION = 1.8;

const IMG: HTMLImageElement = (() => {
	const img = new Image();
	img.src = 'assets/sprites/projectiles/hostile/shadowbullet.png';
	return img;
})();

export class BurstShadowBullet extends BaseProjectile {
	readonly isShadow = true;
	readonly damage = 0;

	private life: number = 0;

	constructor(x: number, y: number, vx: number, vy: number) {
		super(x, y, vx, vy, MAX_SIZE, MAX_SIZE);
		this.hitRadius = 0;
	}

	override update(dt: number): void {
		this.life += dt;
		super.update(dt);
	}

	render(ctx: CanvasRenderingContext2D): void {
		const t = Math.min(1, this.life / EXPAND_DURATION);
		const size = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * t;
		ctx.drawImage(IMG, this.x - size / 2, this.y - size / 2, size, size);
	}
}
