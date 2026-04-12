import { BaseProjectile } from '../Projectile';
import { makeSheet } from './BulletSprites';
import { Spritesheet } from '../../utils/Spritesheet';

const SPIN_SPEED = 3.0;
const SIZE = 16;

export class StarBullet extends BaseProjectile {
	private sheet: Spritesheet;
	private rotation: number = 0;

	constructor(x: number, y: number, vx: number, vy: number) {
		super(x, y, vx, vy, SIZE, SIZE);
		this.sheet = makeSheet(
			'assets/sprites/projectiles/hostile/staryellow.png',
			SIZE,
			SIZE
		);
	}

	update(dt: number): void {
		super.update(dt);
		this.rotation += SPIN_SPEED * dt;
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		this.sheet.draw(ctx, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
		ctx.restore();
	}
}
