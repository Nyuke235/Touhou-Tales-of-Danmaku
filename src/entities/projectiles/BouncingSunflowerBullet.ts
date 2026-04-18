import { SunflowerBullet } from './SunflowerBullet';
import { FIELD } from '../../game/Constants';

const RADIUS = 24;
const LEFT_BOUND = RADIUS;
const RIGHT_BOUND = FIELD.WIDTH - RADIUS;

export class BouncingSunflowerBullet extends SunflowerBullet {
	override update(dt: number): void {
		if (this.x <= LEFT_BOUND && this.vx < 0) this.vx = -this.vx;
		if (this.x >= RIGHT_BOUND && this.vx > 0) this.vx = -this.vx;
		super.update(dt);
	}
}
