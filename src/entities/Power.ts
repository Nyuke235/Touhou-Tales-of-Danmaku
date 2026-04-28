import { BulletManager } from '../systems/BulletManager';

export interface IOption {
	x: number;
	y: number;
	update(dt: number): void;
	shoot(
		bulletManager: BulletManager,
		getNearestEnemy: (x: number, y: number) => { x: number; y: number } | null,
		px: number,
		focused: boolean
	): void;
	render(ctx: CanvasRenderingContext2D): void;
}
