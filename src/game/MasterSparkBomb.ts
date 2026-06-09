import { EnemyManager } from '../systems/EnemyManager';

export const MASTER_SPARK_DURATION = 4.0;
const DAMAGE_TICK_INTERVAL = 0.1;
const DAMAGE_PER_TICK = 5;

const HALF_WIDTH = 58;
const BOTTOM_OFFSET = -4;
const CORNER_R = 30;
const TOP_Y = -200;

export class MasterSparkBomb {
	private elapsed: number = 0;
	private tickTimer: number = 0;
	x: number = 0;
	y: number = 0;

	update(
		dt: number,
		marisaX: number,
		marisaY: number,
		enemies: EnemyManager
	): void {
		this.x = marisaX;
		this.y = marisaY;
		this.elapsed += dt;

		this.tickTimer += dt;
		while (this.tickTimer >= DAMAGE_TICK_INTERVAL) {
			this.tickTimer -= DAMAGE_TICK_INTERVAL;
			this.applyTick(enemies);
		}
	}

	private applyTick(enemies: EnemyManager): void {
		const left = this.x - HALF_WIDTH;
		const right = this.x + HALF_WIDTH;
		const bottom = this.y + BOTTOM_OFFSET;

		for (const e of enemies.getEnemies()) {
			if (!e.active || e.isDying()) continue;
			const ex1 = e.x - e.width / 2;
			const ex2 = e.x + e.width / 2;
			const ey1 = e.y - e.height / 2;
			const ey2 = e.y + e.height / 2;

			if (rectIntersect(ex1, ey1, ex2, ey2, left, TOP_Y, right, bottom)) {
				enemies.dealDirectDamage(e, DAMAGE_PER_TICK);
			}
		}
	}

	render(ctx: CanvasRenderingContext2D): void {
		const flicker = 0.85 + 0.15 * Math.sin(this.elapsed * 24);
		const fadeIn = Math.min(1, this.elapsed / 0.2);
		const fadeOut = Math.min(1, (MASTER_SPARK_DURATION - this.elapsed) / 0.3);
		const alpha = Math.max(0, Math.min(fadeIn, fadeOut));
		if (alpha <= 0) return;

		const left = this.x - HALF_WIDTH;
		const right = this.x + HALF_WIDTH;
		const bottom = this.y + BOTTOM_OFFSET;

		const outerPath = buildUPath(left, right, bottom, CORNER_R);

		ctx.save();
		ctx.globalCompositeOperation = 'lighter';

		ctx.save();
		ctx.globalAlpha = alpha * 0.55 * flicker;
		ctx.fillStyle = '#3a7dff';
		ctx.shadowColor = '#5fb0ff';
		ctx.shadowBlur = 28;
		ctx.fill(outerPath);
		ctx.restore();

		ctx.save();
		ctx.globalAlpha = alpha * 0.85 * flicker;
		ctx.fillStyle = '#88c8ff';
		ctx.shadowColor = '#a0ddff';
		ctx.shadowBlur = 14;
		ctx.fill(outerPath);
		ctx.restore();

		const coreInset = 10;
		const corePath = buildUPath(
			left + coreInset,
			right - coreInset,
			bottom - coreInset,
			Math.max(4, CORNER_R - coreInset)
		);
		ctx.save();
		ctx.globalAlpha = alpha * flicker;
		ctx.fillStyle = '#ffffff';
		ctx.shadowColor = '#e6f4ff';
		ctx.shadowBlur = 10;
		ctx.fill(corePath);
		ctx.restore();

		ctx.restore();
	}

	isDone(): boolean {
		return this.elapsed >= MASTER_SPARK_DURATION;
	}
}

function rectIntersect(
	ax1: number,
	ay1: number,
	ax2: number,
	ay2: number,
	bx1: number,
	by1: number,
	bx2: number,
	by2: number
): boolean {
	return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
}

function buildUPath(
	left: number,
	right: number,
	bottom: number,
	cornerR: number
): Path2D {
	const p = new Path2D();
	p.moveTo(left, TOP_Y);
	p.lineTo(left, bottom - cornerR);
	p.quadraticCurveTo(left, bottom, left + cornerR, bottom);
	p.lineTo(right - cornerR, bottom);
	p.quadraticCurveTo(right, bottom, right, bottom - cornerR);
	p.lineTo(right, TOP_Y);
	p.closePath();
	return p;
}
