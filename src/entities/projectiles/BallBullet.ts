import { StaticBullet } from './StaticBullet';
import { BulletColor, BALL_SPRITES } from './BulletSprites';

export class BallBullet extends StaticBullet {
	constructor(
		x: number,
		y: number,
		vx: number,
		vy: number,
		color: BulletColor = 'blue'
	) {
		super(x, y, vx, vy, 12, 12, BALL_SPRITES[color] ?? BALL_SPRITES.blue!);
	}
}
