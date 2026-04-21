import { StaticBullet } from './StaticBullet';

const SPIN_SPEED = 1.2;
const GRAVITY = 150;
const MAX_LIFETIME = 9.0;
const W = 20;
const H = 21;

export class BouncingIceCubeBullet extends StaticBullet {
	private spinAngle: number = 0;
	private lifetime: number = 0;

	constructor(x: number, y: number, vx: number, vy: number) {
		super(x, y, vx, vy, W, H, 'assets/sprites/projectiles/hostile/icecube.png');
		this.spinAngle = Math.random() * Math.PI * 2;
		this.hitRadius = 8;
	}

	override update(dt: number): void {
		this.spinAngle += SPIN_SPEED * dt;
		this.vy += GRAVITY * dt;
		this.lifetime += dt;
		if (this.lifetime >= MAX_LIFETIME) {
			this.active = false;
			return;
		}
		super.update(dt);
	}

	override checkBounds(): void {
		const halfW = W / 2;

		if (this.x - halfW <= 0 && this.vx < 0) {
			this.x = halfW;
			this.vx = -this.vx;
		}
		if (this.x + halfW >= BouncingIceCubeBullet.FIELD_W && this.vx > 0) {
			this.x = BouncingIceCubeBullet.FIELD_W - halfW;
			this.vx = -this.vx;
		}
		if (this.y + H < 0 || this.y - H > BouncingIceCubeBullet.FIELD_H) {
			this.active = false;
		}
	}

	override render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.spinAngle);
		this.sheet.draw(ctx, -W / 2, -H / 2, W, H);
		ctx.restore();
	}
}
