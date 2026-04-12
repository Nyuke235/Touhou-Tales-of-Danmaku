import { BaseProjectile, type IProjectile } from '../Projectile';
import { RiceBullet } from './RiceBullet';

const BURST_DELAY = 1.8;
const BURST_COUNT = 18;
const BURST_SPEED = 75;
const MAX_SIZE = 48;
const MIN_SIZE = 4;

const IMG: HTMLImageElement = (() => {
	const img = new Image();
	img.src = 'assets/sprites/projectiles/hostile/shadowbullet.png';
	return img;
})();

export class BurstShadowBullet extends BaseProjectile {
	readonly isShadow = true;
	readonly damage = 0;
	pendingSpawns: IProjectile[] = [];

	private life: number = 0;
	private hasBurst: boolean = false;

	constructor(x: number, y: number, vx: number, vy: number) {
		super(x, y, vx, vy, MAX_SIZE, MAX_SIZE);
		this.hitRadius = 0;
	}

	override update(dt: number): void {
		this.life += dt;
		super.update(dt);

		if (!this.hasBurst && this.life >= BURST_DELAY) {
			this.hasBurst = true;
			for (let i = 0; i < BURST_COUNT; i++) {
				const angle = (i / BURST_COUNT) * Math.PI * 2;
				this.pendingSpawns.push(
					new RiceBullet(
						this.x,
						this.y,
						Math.cos(angle) * BURST_SPEED,
						Math.sin(angle) * BURST_SPEED,
						'purple'
					)
				);
			}
			this.active = false;
		}
	}

	render(ctx: CanvasRenderingContext2D): void {
		const t = Math.min(1, this.life / BURST_DELAY);
		const size = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * t;
		ctx.drawImage(IMG, this.x - size / 2, this.y - size / 2, size, size);
	}
}
