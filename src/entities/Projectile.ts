import { FIELD } from '../game/Constants';

export interface IProjectile {
	x: number;
	y: number;
	active: boolean;
	hitRadius: number;
	damage: number;
	isShadow?: boolean;
	grazed?: boolean;
	pendingSpawns?: IProjectile[];
	update(dt: number): void;
	render(ctx: CanvasRenderingContext2D): void;
}

export abstract class BaseProjectile implements IProjectile {
	x: number;
	y: number;
	vx: number;
	vy: number;
	active: boolean = true;
	damage: number = 1;

	protected width: number;
	protected height: number;
	hitRadius: number;

	protected static readonly FIELD_W = FIELD.WIDTH;
	protected static readonly FIELD_H = FIELD.HEIGHT;

	constructor(
		x: number,
		y: number,
		vx: number,
		vy: number,
		width: number,
		height: number
	) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.width = width;
		this.height = height;
		this.hitRadius = Math.min(width, height) / 2 - 2;
	}

	update(dt: number) {
		this.x += this.vx * dt;
		this.y += this.vy * dt;
		this.checkBounds();
	}

	checkBounds(): void {
		if (
			this.x + this.width < 0 ||
			this.x - this.width > BaseProjectile.FIELD_W ||
			this.y + this.height < 0 ||
			this.y - this.height > BaseProjectile.FIELD_H
		) {
			this.active = false;
		}
	}

	abstract render(ctx: CanvasRenderingContext2D): void;
}
