import { StaticBullet } from './StaticBullet';

const SPIN_SPEED = 3.0;
const SIZE = 48;

export class SunflowerBullet extends StaticBullet {
	private spinAngle: number = 0;

	constructor(x: number, y: number, vx: number, vy: number) {
		super(
			x,
			y,
			vx,
			vy,
			SIZE,
			SIZE,
			'assets/sprites/bullets/hostile/sunflower.png'
		);
		this.hitRadius -= 4;
		this.spinAngle = Math.random() * Math.PI * 2;
	}

	override update(dt: number): void {
		this.spinAngle += SPIN_SPEED * dt;
		super.update(dt);
	}

	override render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.spinAngle);
		this.sheet.draw(ctx, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
		ctx.restore();
	}
}
