import { BaseBullet } from '../Bullet';
import { Spritesheet } from '../../utils/Spritesheet';
import { BulletColor, makeSheet } from './BulletSprites';

const LENGTH = 60;
const WIDTH = 16;

const SPRITES: Partial<Record<BulletColor, string>> = {
	orange: 'assets/sprites/bullets/hostile/laserorange.png',
};

export class OvalLaserBullet extends BaseBullet {
	private readonly angle: number;
	private readonly sheet: Spritesheet;

	constructor(
		x: number,
		y: number,
		vx: number,
		vy: number,
		color: BulletColor = 'orange'
	) {
		super(x, y, vx, vy, LENGTH, WIDTH);
		this.angle = Math.atan2(vy, vx);
		const src = SPRITES[color] ?? SPRITES.orange!;
		this.sheet = makeSheet(src, WIDTH, LENGTH);
		this.hitRadius = WIDTH / 2;
	}

	checkTrailHit(px: number, py: number, hitR: number): boolean {
		const halfL = LENGTH / 2 - WIDTH / 2;
		const cos = Math.cos(this.angle);
		const sin = Math.sin(this.angle);
		const ax = this.x - cos * halfL;
		const ay = this.y - sin * halfL;
		const bx = this.x + cos * halfL;
		const by = this.y + sin * halfL;

		const abx = bx - ax;
		const aby = by - ay;
		const len2 = abx * abx + aby * aby;
		const t =
			len2 === 0
				? 0
				: Math.max(0, Math.min(1, ((px - ax) * abx + (py - ay) * aby) / len2));
		const cx = ax + t * abx;
		const cy = ay + t * aby;
		const dx = px - cx;
		const dy = py - cy;
		const r = hitR + WIDTH / 2;
		return dx * dx + dy * dy <= r * r;
	}

	override render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle + Math.PI / 2);
		this.sheet.draw(ctx, -WIDTH / 2, -LENGTH / 2, WIDTH, LENGTH);
		ctx.restore();
	}
}
