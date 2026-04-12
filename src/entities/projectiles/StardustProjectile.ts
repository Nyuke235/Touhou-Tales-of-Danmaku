import { BaseProjectile } from '../Projectile';
import { Spritesheet } from '../../utils/Spritesheet';

export class StardustProjectile extends BaseProjectile {
	private sheet: Spritesheet;

	constructor(x: number, y: number) {
		super(x, y, 0, -320, 6, 8);

		this.sheet = new Spritesheet({
			src: 'assets/sprites/projectiles/player/stardust.png',
			frameX: 6,
			frameY: 8,
			frameCount: 1,
			frameSpeed: 0,
		});
	}

	update(dt: number): void {
		super.update(dt);
		this.sheet.update(dt);
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
