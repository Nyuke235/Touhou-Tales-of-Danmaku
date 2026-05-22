import { StaticBullet } from './StaticBullet';

const MAX_RADIUS = 320;

export class OrbitingBullet extends StaticBullet {
	private centerX: number;
	private centerY: number;
	private angle: number;
	private radius: number = 0;
	private angularVel: number;
	private radialVel: number;
	private spin: number;
	private rotation: number = 0;

	constructor(
		cx: number,
		cy: number,
		angle: number,
		angularVel: number,
		radialVel: number,
		spriteSrc: string,
		size: number = 12,
		spinSpeed: number = 0
	) {
		super(cx, cy, 0, 0, size, size, spriteSrc);
		this.centerX = cx;
		this.centerY = cy;
		this.angle = angle;
		this.angularVel = angularVel;
		this.radialVel = radialVel;
		this.spin = spinSpeed;
		this.hitRadius = Math.max(5, size / 2 - 2);
	}

	override update(dt: number): void {
		this.angle += this.angularVel * dt;
		this.radius += this.radialVel * dt;
		this.rotation += this.spin * dt;
		this.x = this.centerX + Math.cos(this.angle) * this.radius;
		this.y = this.centerY + Math.sin(this.angle) * this.radius;
		if (this.radius > MAX_RADIUS) this.active = false;
	}

	override render(ctx: CanvasRenderingContext2D): void {
		if (this.spin === 0) {
			super.render(ctx);
			return;
		}
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		this.sheet.draw(
			ctx,
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height
		);
		ctx.restore();
	}
}
