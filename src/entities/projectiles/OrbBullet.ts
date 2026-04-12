import { StaticBullet } from './StaticBullet';
import { BulletColor, ORB_SPRITES } from './BulletSprites';

export class OrbBullet extends StaticBullet {
	constructor(
		x: number,
		y: number,
		vx: number,
		vy: number,
		color: BulletColor = 'yellow'
	) {
		const src = ORB_SPRITES[color] ?? ORB_SPRITES.yellow!;
		super(x, y, vx, vy, 24, 24, src);
	}
}
