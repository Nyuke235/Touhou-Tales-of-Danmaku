import { RotatedBullet } from './RotatedBullet';
import { BulletColor, RICE_SPRITES } from './BulletSprites';

export class FountainRiceBullet extends RotatedBullet {
	private initVx: number;
	private decelTime: number;
	private decelFloor: number;
	private gravity: number;
	private vyMax: number;
	private elapsed: number = 0;

	constructor(
		x: number,
		y: number,
		vx: number,
		vy: number,
		color: BulletColor,
		decelTime: number,
		decelFloor: number,
		gravity: number,
		vyMax: number
	) {
		const src = RICE_SPRITES[color] ?? RICE_SPRITES.purple!;
		super(x, y, vx, vy, 6, 10, src);
		this.initVx = vx;
		this.decelTime = decelTime;
		this.decelFloor = decelFloor;
		this.gravity = gravity;
		this.vyMax = vyMax;
	}

	override update(dt: number): void {
		this.elapsed += dt;
		if (this.elapsed < this.decelTime) {
			const t = this.elapsed / this.decelTime;
			this.vx = this.initVx * (1 - t * (1 - this.decelFloor));
		} else {
			this.vx = this.initVx * this.decelFloor;
		}
		this.vy = Math.min(this.vy + this.gravity * dt, this.vyMax);
		const speed = Math.hypot(this.vx, this.vy);
		if (speed > 1) {
			this.angle = Math.atan2(this.vy, this.vx) + Math.PI / 2;
		}
		super.update(dt);
	}
}
