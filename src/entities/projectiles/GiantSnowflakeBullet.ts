import { StaticBullet } from './StaticBullet';

const SPIN_SPEED = 0.9;
const W = 34;
const H = 34;
const FREEZE_RADIUS = 48;
const GROW_DURATION = 0.6;

export class GiantSnowflakeBullet extends StaticBullet {
	private spinAngle: number = 0;
	private growElapsed: number = 0;
	readonly freezeRadius = FREEZE_RADIUS;

	constructor(x: number, y: number, vx: number, vy: number) {
		super(
			x,
			y,
			vx,
			vy,
			W,
			H,
			'assets/sprites/projectiles/hostile/giantsnowflake.png'
		);
		this.spinAngle = Math.random() * Math.PI * 2;
		this.hitRadius = 12;
	}

	override update(dt: number): void {
		this.spinAngle += SPIN_SPEED * dt;
		if (this.growElapsed < GROW_DURATION) this.growElapsed += dt;
		super.update(dt);
	}

	override render(ctx: CanvasRenderingContext2D): void {
		const scale = Math.min(1, this.growElapsed / GROW_DURATION);

		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x, this.y, FREEZE_RADIUS * scale, 0, Math.PI * 2);
		ctx.strokeStyle = 'rgba(120, 220, 255, 0.25)';
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.fillStyle = 'rgba(80, 180, 255, 0.08)';
		ctx.fill();
		ctx.restore();

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.spinAngle);
		ctx.scale(scale, scale);
		this.sheet.draw(ctx, -W / 2, -H / 2, W, H);
		ctx.restore();
	}
}
