import { BaseProjectile } from '../Projectile';
import { BulletColor, ORB_SPRITES } from './BulletSprites';
import { makeSheet } from './BulletSprites';
import { Spritesheet } from '../../utils/Spritesheet';

const MAX_TRAIL = 100;
const DRAIN_RATE = 60;
const MAX_RADIUS = 480;

const GLOW_COLOR: Record<string, string> = {
	purple: 'rgba(180,0,255,0.9)',
	blue: 'rgba(0,100,255,0.9)',
	red: 'rgba(255,0,0,0.9)',
	yellow: 'rgba(220,180,0,0.9)',
	orange: 'rgba(255,100,0,0.9)',
};

const TRAIL_FILL: Record<string, string> = {
	purple: '#cc66ff',
	blue: '#66aaff',
	red: '#ff6666',
	yellow: '#ffdd66',
	orange: '#ff9966',
};

export class LaserTrailBullet extends BaseProjectile {
	private readonly trailBuf: Float32Array;
	private trailHead: number = 0;
	private trailCount: number = 0;

	private readonly centerX: number;
	private readonly centerY: number;
	private orbitAngle: number;
	private radius: number = 0;
	private readonly angularVel: number;
	private readonly radialVel: number;
	private readonly color: BulletColor;

	private readonly headSheet: Spritesheet;
	private static readonly ORB_SIZE = 24;
	private static readonly HEAD_R = 10;

	private static readonly TRAIL_MAX_W = 18;
	private static readonly TRAIL_MIN_W = 0.5;

	private headAlive: boolean = true;
	private drainAcc: number = 0;

	constructor(
		cx: number,
		cy: number,
		angle: number,
		angularVel: number,
		radialVel: number,
		color: BulletColor = 'purple'
	) {
		super(cx, cy, 0, 0, LaserTrailBullet.ORB_SIZE, LaserTrailBullet.ORB_SIZE);
		this.centerX = cx;
		this.centerY = cy;
		this.orbitAngle = angle;
		this.angularVel = angularVel;
		this.radialVel = radialVel;
		this.color = color;
		this.hitRadius = LaserTrailBullet.HEAD_R;
		this.trailBuf = new Float32Array(MAX_TRAIL * 2);

		const src = ORB_SPRITES[color] ?? ORB_SPRITES.purple!;
		this.headSheet = makeSheet(
			src,
			LaserTrailBullet.ORB_SIZE,
			LaserTrailBullet.ORB_SIZE
		);
	}

	override update(dt: number): void {
		if (this.headAlive) {
			this.orbitAngle += this.angularVel * dt;
			this.radius += this.radialVel * dt;
			this.x = this.centerX + Math.cos(this.orbitAngle) * this.radius;
			this.y = this.centerY + Math.sin(this.orbitAngle) * this.radius;

			this.trailBuf[this.trailHead * 2] = this.x;
			this.trailBuf[this.trailHead * 2 + 1] = this.y;
			this.trailHead = (this.trailHead + 1) % MAX_TRAIL;
			if (this.trailCount < MAX_TRAIL) this.trailCount++;

			const hw = this.width / 2;
			const hh = this.height / 2;
			const outOfBounds =
				this.x + hw < 0 ||
				this.x - hw > BaseProjectile.FIELD_W ||
				this.y + hh < 0 ||
				this.y - hh > BaseProjectile.FIELD_H;

			if (this.radius > MAX_RADIUS || outOfBounds) {
				this.headAlive = false;
				this.hitRadius = 0;
			}
		} else {
			this.drainAcc += DRAIN_RATE * dt;
			const toDrain = Math.floor(this.drainAcc);
			this.drainAcc -= toDrain;
			this.trailCount = Math.max(0, this.trailCount - toDrain);

			if (this.trailCount === 0) {
				this.active = false;
			}
		}
	}

	checkTrailHit(px: number, py: number, hitR: number): boolean {
		for (let i = 1; i < this.trailCount; i += 3) {
			const idx =
				(((this.trailHead - 1 - i) % MAX_TRAIL) + MAX_TRAIL) % MAX_TRAIL;
			const tx = this.trailBuf[idx * 2];
			const ty = this.trailBuf[idx * 2 + 1];

			const t = i / (this.trailCount - 1 || 1);
			const tr = LaserTrailBullet.HEAD_R * (1 - t * 0.8);

			const dx = tx - px;
			const dy = ty - py;
			if (dx * dx + dy * dy <= (hitR + tr) ** 2) return true;
		}
		return false;
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.trailCount === 0) return;

		const fill = TRAIL_FILL[this.color] ?? TRAIL_FILL.purple;
		const glow = GLOW_COLOR[this.color] ?? GLOW_COLOR.purple;
		const maxW = LaserTrailBullet.TRAIL_MAX_W;
		const minW = LaserTrailBullet.TRAIL_MIN_W;

		ctx.save();

		for (let i = 0; i < this.trailCount; i += 2) {
			const idx =
				(((this.trailHead - 1 - i) % MAX_TRAIL) + MAX_TRAIL) % MAX_TRAIL;
			const tx = this.trailBuf[idx * 2];
			const ty = this.trailBuf[idx * 2 + 1];

			const t = i / (this.trailCount - 1 || 1);
			const r = (maxW * (1 - t) + minW * t) / 2;
			const a = 1.0 - t * 0.97;

			ctx.globalAlpha = a;
			ctx.fillStyle = fill;
			ctx.beginPath();
			ctx.arc(tx, ty, r, 0, Math.PI * 2);
			ctx.fill();
		}

		if (this.headAlive) {
			ctx.globalAlpha = 1.0;
			ctx.shadowColor = glow;
			ctx.shadowBlur = 14;
			const s = LaserTrailBullet.ORB_SIZE;
			this.headSheet.draw(ctx, this.x - s / 2, this.y - s / 2, s, s);
			ctx.shadowBlur = 0;
		}

		ctx.restore();
	}
}
