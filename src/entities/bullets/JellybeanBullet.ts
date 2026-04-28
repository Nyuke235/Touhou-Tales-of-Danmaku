import { RotatedBullet } from './RotatedBullet';
import { BulletColor, JELLYBEAN_SPRITES } from './BulletSprites';

export class JellybeanBullet extends RotatedBullet {
	constructor(
		x: number,
		y: number,
		vx: number,
		vy: number,
		color: BulletColor = 'purple'
	) {
		const src = JELLYBEAN_SPRITES[color] ?? JELLYBEAN_SPRITES.purple!;
		super(x, y, vx, vy, 10, 16, src);
	}
}
