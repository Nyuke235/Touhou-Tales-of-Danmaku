import { IBullet } from '../Bullet';

const MAX_RADIUS = 150;
const EXPAND_DURATION = 0.7;
const DURATION = 0.8;
const RING_THICKNESS = 6;

export class ShockwaveBullet implements IBullet {
	x: number;
	y: number;
	active: boolean = true;
	hitRadius: number = 0;
	damage: number = 1;
	isShadow: boolean = false;
	grazed: boolean = false;

	private elapsed: number = 0;
	private currentRadius: number = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	update(dt: number): void {
		this.elapsed += dt;
		const t = Math.min(1, this.elapsed / EXPAND_DURATION);
		this.currentRadius = (1 - (1 - t) * (1 - t)) * MAX_RADIUS;
		if (this.elapsed >= DURATION) {
			this.active = false;
		}
	}

	checkTrailHit(px: number, py: number, hitR: number): boolean {
		const dx = px - this.x;
		const dy = py - this.y;
		const dist = Math.sqrt(dx * dx + dy * dy);
		const inner = this.currentRadius - RING_THICKNESS;
		return dist + hitR >= inner && dist - hitR <= this.currentRadius;
	}

	render(ctx: CanvasRenderingContext2D): void {
		const progress = this.elapsed / DURATION;
		const alpha = 1 - progress * 0.7;

		ctx.save();
		ctx.globalAlpha = alpha;
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 3 + (1 - progress) * 4;
		ctx.shadowColor = 'white';
		ctx.shadowBlur = 8;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
		ctx.stroke();
		ctx.restore();
	}
}
