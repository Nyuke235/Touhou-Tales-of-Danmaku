import { RotatedBullet } from './RotatedBullet';
import { BulletColor, ARROWHEAD_SPRITES } from './BulletSprites';

export class ArrowheadBullet extends RotatedBullet {
	constructor(
		x: number,
		y: number,
		vx: number,
		vy: number,
		color: BulletColor = 'blue'
	) {
		const src = ARROWHEAD_SPRITES[color] ?? ARROWHEAD_SPRITES.blue!;
		super(x, y, vx, vy, 12, 12, src);
	}
}
