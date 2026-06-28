import { IBullet } from '../Bullet';
import { FeatherBullet } from './FeatherBullet';
import { computeEndPoint } from './CircleLaserBullet';
import { PlayerPosition } from '../../game/PlayerPosition';
import { SoundManager, SFX } from '../../systems/SoundManager';

type LullabyPhase = 'aiming' | 'locked' | 'firing';

export interface LullabyLaserConfig {
	aimDuration: number;
	lockDuration: number;
	fireDuration: number;
	featherRate: number;
	featherSpeed: number;
	featherSpread: number;
}

export class LullabyLaserBullet implements IBullet {
	x: number;
	y: number;
	active: boolean = true;
	hitRadius: number = 0;
	damage: number = 0;
	pendingSpawns?: IBullet[];

	private readonly cfg: LullabyLaserConfig;
	private phase: LullabyPhase = 'aiming';
	private elapsed: number = 0;
	private aimAngle: number = 0;
	private featherTimer: number = 0;

	constructor(originX: number, originY: number, cfg: LullabyLaserConfig) {
		this.x = originX;
		this.y = originY;
		this.cfg = cfg;
		this.aimAngle = Math.atan2(
			PlayerPosition.y - originY,
			PlayerPosition.x - originX
		);
	}

	update(dt: number): void {
		this.elapsed += dt;

		if (this.phase === 'aiming') {
			this.aimAngle = Math.atan2(
				PlayerPosition.y - this.y,
				PlayerPosition.x - this.x
			);
			if (this.elapsed >= this.cfg.aimDuration) {
				this.phase = 'locked';
				this.elapsed = 0;
			}
			return;
		}

		if (this.phase === 'locked') {
			if (this.elapsed >= this.cfg.lockDuration) {
				this.phase = 'firing';
				this.elapsed = 0;
				this.featherTimer = 0;
				SoundManager.play(SFX.MYSTIA_THROW);
			}
			return;
		}

		const interval = 1 / this.cfg.featherRate;
		this.featherTimer += dt;
		while (this.featherTimer >= interval) {
			this.featherTimer -= interval;
			const a =
				this.aimAngle + (Math.random() - 0.5) * this.cfg.featherSpread;
			if (!this.pendingSpawns) this.pendingSpawns = [];
			this.pendingSpawns.push(
				new FeatherBullet(
					this.x,
					this.y,
					Math.cos(a) * this.cfg.featherSpeed,
					Math.sin(a) * this.cfg.featherSpeed
				) as IBullet
			);
		}
		if (this.elapsed >= this.cfg.fireDuration) {
			this.active = false;
		}
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.phase === 'firing') return;
		const [endX, endY] = computeEndPoint(this.x, this.y, this.aimAngle);

		ctx.save();
		ctx.lineCap = 'round';
		if (this.phase === 'aiming') {
			ctx.globalAlpha = 0.55;
			ctx.strokeStyle = '#ff99cc';
			ctx.lineWidth = 0.6;
		} else {
			const blink = 0.3 + 0.7 * Math.abs(Math.sin(this.elapsed * Math.PI * 14));
			ctx.globalAlpha = blink;
			ctx.strokeStyle = '#ff66aa';
			ctx.lineWidth = 1.2;
			ctx.shadowColor = '#ff99cc';
			ctx.shadowBlur = 4;
		}
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(endX, endY);
		ctx.stroke();
		ctx.restore();
	}
}
