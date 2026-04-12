import { IOption } from '../Power';
import { Spritesheet } from '../../utils/Spritesheet';
import { ProjectileManager } from '../../systems/ProjectileManager';
import { HakkeroLaser } from '../projectiles/HakkeroLaser';

const SIZE = 12;

export class Hakkero implements IOption {
	x: number = 0;
	y: number = 0;
	private sheet: Spritesheet;

	constructor() {
		this.sheet = new Spritesheet({
			src: 'assets/sprites/entities/other/hakkero.png',
			frameX: SIZE,
			frameY: SIZE,
			frameCount: 1,
			frameSpeed: 0,
		});
	}

	update(_dt: number): void {}

	shoot(
		projectileManager: ProjectileManager,
		_getNearestEnemy: (x: number, y: number) => { x: number; y: number } | null,
		_px: number,
		_focused: boolean
	): void {
		projectileManager.addPlayerProjectile(new HakkeroLaser(this.x, this.y));
	}

	render(ctx: CanvasRenderingContext2D): void {
		this.sheet.draw(ctx, this.x - SIZE / 2, this.y - SIZE / 2, SIZE, SIZE);
	}
}
