import { BaseBullet } from '../Bullet';
import { BulletColor } from './BulletSprites';
import { FIELD } from '../../game/Constants';
import { SoundManager, SFX } from '../../systems/SoundManager';

export function computeEndPoint(
	ox: number,
	oy: number,
	angle: number
): [number, number] {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	let tMin = Infinity;

	if (cos > 1e-9) tMin = Math.min(tMin, (FIELD.WIDTH - ox) / cos);
	else if (cos < -1e-9) tMin = Math.min(tMin, -ox / cos);

	if (sin > 1e-9) tMin = Math.min(tMin, (FIELD.HEIGHT - oy) / sin);
	else if (sin < -1e-9) tMin = Math.min(tMin, -oy / sin);

	return [ox + cos * tMin, oy + sin * tMin];
}

function pointToSegmentDist2(
	px: number,
	py: number,
	ax: number,
	ay: number,
	bx: number,
	by: number
): number {
	const abx = bx - ax,
		aby = by - ay;
	const len2 = abx * abx + aby * aby;
	if (len2 === 0) {
		const dx = px - ax,
			dy = py - ay;
		return dx * dx + dy * dy;
	}
	const t = Math.max(
		0,
		Math.min(1, ((px - ax) * abx + (py - ay) * aby) / len2)
	);
	const cx = ax + t * abx,
		cy = ay + t * aby;
	const dx = px - cx,
		dy = py - cy;
	return dx * dx + dy * dy;
}

const WARN_COLORS: Record<string, string> = {
	blue: '#88aaff',
	cyan: '#88ffff',
	red: '#ff8888',
	yellow: '#ffee88',
	purple: '#cc88ff',
	green: '#88ff88',
	gray: '#cccccc',
	orange: '#ffaa88',
};

const CORE_COLORS: Record<string, string> = {
	blue: '#4488ff',
	cyan: '#44ffee',
	red: '#ff4444',
	yellow: '#ffcc44',
	purple: '#aa44ff',
	green: '#44ff88',
	gray: '#aaaaaa',
	orange: '#ff8844',
};

const GLOW_COLORS: Record<string, string> = {
	blue: 'rgba(80,140,255,0.8)',
	cyan: 'rgba(80,255,220,0.8)',
	red: 'rgba(255,80,80,0.8)',
	yellow: 'rgba(255,200,80,0.8)',
	purple: 'rgba(180,80,255,0.8)',
	green: 'rgba(80,255,130,0.8)',
	gray: 'rgba(180,180,180,0.8)',
	orange: 'rgba(255,140,80,0.8)',
};

type LaserPhase = 'waiting' | 'warning' | 'active';

export class CircleLaserBullet extends BaseBullet {
	private readonly originX: number;
	private readonly originY: number;
	private readonly endX: number;
	private readonly endY: number;
	private readonly warnDuration: number;
	private readonly activeDuration: number;
	private readonly color: BulletColor;

	private elapsed: number = 0;
	private readonly fireDelay: number;
	private phase: LaserPhase = 'waiting';

	constructor(
		originX: number,
		originY: number,
		angle: number,
		fireDelay: number,
		warnDuration: number,
		activeDuration: number,
		color: BulletColor
	) {
		super(originX, originY, 0, 0, 1, 1);
		this.originX = originX;
		this.originY = originY;
		this.fireDelay = fireDelay;
		this.warnDuration = warnDuration;
		this.activeDuration = activeDuration;
		this.color = color;
		this.hitRadius = 0;

		const [ex, ey] = computeEndPoint(originX, originY, angle);
		this.endX = ex;
		this.endY = ey;
	}

	override update(dt: number): void {
		this.elapsed += dt;

		if (this.phase === 'waiting') {
			if (this.elapsed >= this.fireDelay) {
				this.phase = 'warning';
				this.elapsed -= this.fireDelay;
			}
		} else if (this.phase === 'warning') {
			if (this.elapsed >= this.warnDuration) {
				this.phase = 'active';
				this.elapsed -= this.warnDuration;
				SoundManager.play(SFX.LASER);
			}
		} else {
			if (this.elapsed >= this.activeDuration) {
				this.active = false;
			}
		}
	}

	checkTrailHit(px: number, py: number, hitR: number): boolean {
		if (this.phase !== 'active') return false;
		const halfW = 1.5;
		const dist2 = pointToSegmentDist2(
			px,
			py,
			this.originX,
			this.originY,
			this.endX,
			this.endY
		);
		return dist2 <= (halfW + hitR) ** 2;
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.phase === 'waiting') return;

		ctx.save();
		ctx.lineCap = 'round';

		if (this.phase === 'warning') {
			const pulse = 0.5 + 0.5 * Math.sin(this.elapsed * Math.PI * 8);
			ctx.globalAlpha = 0.35 + pulse * 0.45;
			ctx.strokeStyle = WARN_COLORS[this.color] ?? '#ffffff';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(this.originX, this.originY);
			ctx.lineTo(this.endX, this.endY);
			ctx.stroke();
		} else {
			const t = this.elapsed / this.activeDuration;
			const alpha = 1 - t * 0.5;
			const ox = this.originX,
				oy = this.originY,
				ex = this.endX,
				ey = this.endY;

			// outer glow
			ctx.globalAlpha = 0.22 * alpha;
			ctx.strokeStyle = GLOW_COLORS[this.color] ?? 'rgba(255,255,255,0.8)';
			ctx.lineWidth = 11;
			ctx.beginPath();
			ctx.moveTo(ox, oy);
			ctx.lineTo(ex, ey);
			ctx.stroke();

			// core
			ctx.globalAlpha = 0.9 * alpha;
			ctx.strokeStyle = CORE_COLORS[this.color] ?? '#ffffff';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(ox, oy);
			ctx.lineTo(ex, ey);
			ctx.stroke();

			// center white
			ctx.globalAlpha = alpha;
			ctx.strokeStyle = '#ffffff';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(ox, oy);
			ctx.lineTo(ex, ey);
			ctx.stroke();
		}

		ctx.restore();
	}
}
