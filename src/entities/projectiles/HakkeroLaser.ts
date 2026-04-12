import { BaseProjectile } from '../Projectile';

const LASER_SPEED = 500;
const LASER_DAMAGE = 0.4;

export class HakkeroLaser extends BaseProjectile {
	constructor(x: number, y: number) {
		super(x, y, 0, -LASER_SPEED, 4, 24);
		this.damage = LASER_DAMAGE;
	}

	update(dt: number): void {
		super.update(dt);
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.shadowColor = '#ffcc00';
		ctx.shadowBlur = 10;
		ctx.fillStyle = '#ff9900';
		ctx.fillRect(
			this.x - this.width / 2,
			this.y - this.height / 2,
			this.width,
			this.height
		);
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(this.x - 1, this.y - this.height / 2, 2, this.height);
		ctx.restore();
	}
}
