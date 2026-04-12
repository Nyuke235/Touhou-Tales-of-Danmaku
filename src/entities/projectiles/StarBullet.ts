import { BaseProjectile } from '../Projectile';
import { makeSheet } from './BulletSprites';
import { Spritesheet } from '../../utils/Spritesheet';

const SPIN_SPEED = 3.0;
const SIZE = 16;
const SPEED_MULTIPLIER = 3.5;
const DECEL_DURATION = 2.0;

export class StarBullet extends BaseProjectile {
	private sheet: Spritesheet;
	private rotation: number = 0;
	private angle: number;
	private targetSpeed: number;
	private elapsed: number = 0;

	constructor(x: number, y: number, vx: number, vy: number) {
		super(x, y, vx * SPEED_MULTIPLIER, vy * SPEED_MULTIPLIER, SIZE, SIZE);
		this.angle = Math.atan2(vy, vx);
		this.targetSpeed = Math.hypot(vx, vy);
		this.sheet = makeSheet(
			'assets/sprites/projectiles/hostile/staryellow.png',
			SIZE,
			SIZE
		);
	}

	update(dt: number): void {
		if (this.elapsed < DECEL_DURATION) {
			this.elapsed = Math.min(this.elapsed + dt, DECEL_DURATION);
			const t = this.elapsed / DECEL_DURATION;
			const currentSpeed =
				this.targetSpeed * (SPEED_MULTIPLIER - (SPEED_MULTIPLIER - 1) * t);
			this.vx = Math.cos(this.angle) * currentSpeed;
			this.vy = Math.sin(this.angle) * currentSpeed;
		}
		super.update(dt);
		this.rotation += SPIN_SPEED * dt;
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		this.sheet.draw(ctx, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
		ctx.restore();
	}
}
