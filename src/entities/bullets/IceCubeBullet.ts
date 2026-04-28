import { StaticBullet } from './StaticBullet';

const SPIN_SPEED = 0.8;
const W = 20;
const H = 21;

export class IceCubeBullet extends StaticBullet {
	private spinAngle: number = 0;

	constructor(x: number, y: number, vx: number, vy: number) {
		super(x, y, vx, vy, W, H, 'assets/sprites/bullets/hostile/icecube.png');
		this.spinAngle = Math.random() * Math.PI * 2;
		this.hitRadius = 8;
	}

	override update(dt: number): void {
		this.spinAngle += SPIN_SPEED * dt;
		super.update(dt);
	}

	override render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.spinAngle);
		this.sheet.draw(ctx, -W / 2, -H / 2, W, H);
		ctx.restore();
	}
}
