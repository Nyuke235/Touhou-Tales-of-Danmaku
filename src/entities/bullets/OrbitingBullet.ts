import { StaticBullet } from './StaticBullet';
import { BulletColor, BALL_SPRITES } from './BulletSprites';

const MAX_RADIUS = 320;

export class OrbitingBullet extends StaticBullet {
	private centerX: number;
	private centerY: number;
	private angle: number;
	private radius: number = 0;
	private angularVel: number;
	private radialVel: number;

	constructor(
		cx: number,
		cy: number,
		angle: number,
		angularVel: number,
		radialVel: number,
		color: BulletColor = 'purple'
	) {
		super(cx, cy, 0, 0, 12, 12, BALL_SPRITES[color] ?? BALL_SPRITES.yellow!);
		this.centerX = cx;
		this.centerY = cy;
		this.angle = angle;
		this.angularVel = angularVel;
		this.radialVel = radialVel;
		this.hitRadius = 5;
	}

	override update(dt: number): void {
		this.angle += this.angularVel * dt;
		this.radius += this.radialVel * dt;
		this.x = this.centerX + Math.cos(this.angle) * this.radius;
		this.y = this.centerY + Math.sin(this.angle) * this.radius;
		if (this.radius > MAX_RADIUS) this.active = false;
	}
}
