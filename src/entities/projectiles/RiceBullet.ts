import { RotatedBullet } from './RotatedBullet';
import { BulletColor, RICE_SPRITES } from './BulletSprites';

export class RiceBullet extends RotatedBullet {
	constructor(
		x: number,
		y: number,
		vx: number,
		vy: number,
		color: BulletColor = 'purple'
	) {
		const src = RICE_SPRITES[color] ?? RICE_SPRITES.purple!;
		super(x, y, vx, vy, 6, 10, src);
	}
}
