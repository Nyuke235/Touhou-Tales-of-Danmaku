import { BaseBullet } from '../Bullet';

const IMG = (() => {
	const img = new Image();
	img.src = 'assets/sprites/bullets/hostile/shadowbullet.png';
	return img;
})();

const MAX_SIZE = 96;
const MIN_SIZE = 4;
const GROW_DURATION = 3.0;

export class ShadowBullet extends BaseBullet {
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
		const t = Math.min(1, this.life / GROW_DURATION);
		const size = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * t;
		ctx.drawImage(IMG, this.x - size / 2, this.y - size / 2, size, size);
	}
}
