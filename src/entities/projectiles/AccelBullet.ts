import { StaticBullet } from './StaticBullet';
import { BulletColor, BALL_SPRITES } from './BulletSprites';

const MAX_SPEED = 50;
const ACCEL_RATE = 40;

export class AccelBullet extends StaticBullet {
	private speed: number;
	private angle: number;

	constructor(
		x: number,
		y: number,
		angle: number,
		initSpeed: number,
		color: BulletColor
	) {
		super(
			x,
			y,
			Math.cos(angle) * initSpeed,
			Math.sin(angle) * initSpeed,
			12,
			12,
			BALL_SPRITES[color] ?? BALL_SPRITES.yellow
		);
		this.speed = initSpeed;
		this.angle = angle;
	}

	override update(dt: number): void {
		if (this.speed < MAX_SPEED) {
			this.speed = Math.min(MAX_SPEED, this.speed + ACCEL_RATE * dt);
			this.vx = Math.cos(this.angle) * this.speed;
			this.vy = Math.sin(this.angle) * this.speed;
		}
		super.update(dt);
	}
}
