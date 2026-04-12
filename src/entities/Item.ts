import { Spritesheet } from '../utils/Spritesheet';
import { FIELD, ITEM as I } from '../game/Constants';

export type ItemType =
	| 'power'
	| 'point'
	| 'bigpower'
	| 'bigpoint'
	| 'life'
	| 'bomb';

const ITEM_CONFIGS = new Map<ItemType, { src: string; size: number }>([
	['power', { src: 'assets/sprites/entities/items/powermini.png', size: 6 }],
	['point', { src: 'assets/sprites/entities/items/pointmini.png', size: 6 }],
	['bigpower', { src: 'assets/sprites/entities/items/power.png', size: 12 }],
	['bigpoint', { src: 'assets/sprites/entities/items/point.png', size: 12 }],
	['life', { src: 'assets/sprites/entities/items/life.png', size: 12 }],
	['bomb', { src: 'assets/sprites/entities/items/bomb.png', size: 12 }],
]);

const LAUNCH_GRAVITY = 220;

export class Item {
	x: number;
	y: number;
	active: boolean = true;
	attracted: boolean = false;
	type: ItemType;

	private sheet: Spritesheet;
	private size: number;

	private launching: boolean = false;
	private vx: number = 0;
	private vy: number = 0;
	private rotation: number = 0;
	private rotationSpeed: number = 0;

	constructor(x: number, y: number, type: ItemType) {
		this.x = x;
		this.y = y;
		this.type = type;

		const config = ITEM_CONFIGS.get(type)!;
		this.size = config.size;

		this.sheet = new Spritesheet({
			src: config.src,
			frameX: config.size,
			frameY: config.size,
			frameCount: 1,
			frameSpeed: 1,
			looping: false,
		});
	}

	launch(vx: number, vy: number): void {
		this.vx = vx;
		this.vy = vy;
		this.launching = true;
		this.rotationSpeed =
			(Math.random() < 0.5 ? 1 : -1) * (12 + Math.random() * 8);
	}

	update(dt: number, px?: number, py?: number): void {
		if (this.launching) {
			this.vy += LAUNCH_GRAVITY * dt;
			this.x += this.vx * dt;
			this.y += this.vy * dt;
			this.rotation += this.rotationSpeed * dt;
			if (this.vy >= 0) {
				this.launching = false;
			}
			if (this.y - this.size / 2 > FIELD.HEIGHT) {
				this.active = false;
			}
			return;
		}

		if (this.attracted && px !== undefined && py !== undefined) {
			const dx = px - this.x;
			const dy = py - this.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist > 0) {
				this.x += (dx / dist) * I.ATTRACT_SPEED * dt;
				this.y += (dy / dist) * I.ATTRACT_SPEED * dt;
			}
			return;
		}

		this.y += I.FALL_SPEED * dt;

		if (this.y - this.size / 2 > FIELD.HEIGHT) {
			this.active = false;
		}
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		if (this.launching) {
			ctx.translate(this.x, this.y);
			ctx.rotate(this.rotation);
			this.sheet.draw(
				ctx,
				-this.size / 2,
				-this.size / 2,
				this.size,
				this.size
			);
		} else {
			this.sheet.draw(
				ctx,
				this.x - this.size / 2,
				this.y - this.size / 2,
				this.size,
				this.size
			);
		}
		ctx.restore();
	}

	isCollectedBy(
		px: number,
		py: number,
		radius: number = I.COLLECT_RADIUS
	): boolean {
		if (this.launching) return false;
		const dx = this.x - px;
		const dy = this.y - py;
		return Math.sqrt(dx * dx + dy * dy) < radius;
	}
}
