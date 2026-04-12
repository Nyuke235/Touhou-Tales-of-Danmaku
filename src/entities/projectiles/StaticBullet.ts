import { BaseProjectile } from '../Projectile';
import { Spritesheet } from '../../utils/Spritesheet';
import { makeSheet } from './BulletSprites';

export abstract class StaticBullet extends BaseProjectile {
	protected sheet: Spritesheet;

	constructor(
		x: number,
		y: number,
		vx: number,
		vy: number,
		w: number,
		h: number,
		src: string
	) {
		super(x, y, vx, vy, w, h);
		this.sheet = makeSheet(src, w, h);
	}

	render(ctx: CanvasRenderingContext2D): void {
		this.sheet.draw(
			ctx,
			this.x - this.width / 2,
			this.y - this.height / 2,
			this.width,
			this.height
		);
	}
}
