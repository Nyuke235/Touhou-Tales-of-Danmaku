import { StaticBullet } from './StaticBullet';
import { BulletColor, BALL_SPRITES } from './BulletSprites';

export class GravityBullet extends StaticBullet {
	private gravity: number;

	constructor(
		x: number,
		y: number,
		vx: number,
		vy: number,
		gravity: number,
		color: BulletColor = 'blue'
	) {
		super(x, y, vx, vy, 12, 12, BALL_SPRITES[color] ?? BALL_SPRITES.blue);
		this.gravity = gravity;
	}

	update(dt: number): void {
		this.vy += this.gravity * dt;
		super.update(dt);
	}
}
