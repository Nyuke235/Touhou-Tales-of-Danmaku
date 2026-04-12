import { ProjectileManager } from '../systems/ProjectileManager';

export interface IOption {
	x: number;
	y: number;
	update(dt: number): void;
	shoot(
		projectileManager: ProjectileManager,
		getNearestEnemy: (x: number, y: number) => { x: number; y: number } | null,
		px: number,
		focused: boolean
	): void;
	render(ctx: CanvasRenderingContext2D): void;
}
