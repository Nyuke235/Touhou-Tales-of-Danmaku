import { RotatedBullet } from './RotatedBullet';
import { JELLYBEAN_SPRITES } from './BulletSprites';

export class JellybeanBullet extends RotatedBullet {
	constructor(x: number, y: number, vx: number, vy: number) {
		super(x, y, vx, vy, 10, 16, JELLYBEAN_SPRITES.purple);
	}
}
