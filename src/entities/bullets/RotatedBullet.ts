import { BaseBullet } from '../Bullet';
import { Spritesheet } from '../../utils/Spritesheet';
import { makeSheet } from './BulletSprites';

export abstract class RotatedBullet extends BaseBullet {
	protected sheet: Spritesheet;
	protected angle: number;

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
		this.angle = Math.atan2(vy, vx) + Math.PI / 2;
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		this.sheet.draw(
			ctx,
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height
		);
		ctx.restore();
	}
}
