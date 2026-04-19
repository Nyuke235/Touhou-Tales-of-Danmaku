import { Enemy } from '../Enemy';
import { Spritesheet, createExplosionSheet } from '../../utils/Spritesheet';
import { PatternConfig } from '../../game/patterns/PatternEngine';
import { Patterns } from '../../game/patterns/PatternLibrary';
import { IProjectile } from '../Projectile';

export type IceButterflyPath = 'flying-top';

type Phase = 'entering' | 'waiting' | 'leaving';

const STOP_Y = 35;
const WAIT_DURATION = 3.5;
const ENTER_SPEED = 80;
const LEAVE_SPEED = 100;
const FREEZE_RADIUS = 64;

export class IceButterfly extends Enemy {
	private phase: Phase = 'entering';
	private waitTimer: number = 0;
	private leavingSpeed: number = 0;

	constructor(
		x: number,
		y: number,
		_path: IceButterflyPath,
		patterns?: PatternConfig[]
	) {
		const sheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bugs/icebutterfly_spritesheet.png',
			frameX: 40,
			frameY: 40,
			frameCount: 5,
			frameSpeed: 0.12,
			looping: true,
		});

		super(x, y, 40, 40, 40, sheet, createExplosionSheet());
		this.scoreValue = 9000;

		this.setPatterns(patterns ?? [Patterns.BLANK]);
		this.drops = [
			{ type: 'point', count: 4 },
			{ type: 'power', count: 4 },
			{ type: 'life', count: 1 },
		];
	}

	override update(
		dt: number,
		px: number,
		py: number,
		enemyProjectiles: IProjectile[]
	): void {
		super.update(dt, px, py, enemyProjectiles);

		if (!this.exploding) {
			const dx = px - this.x;
			const dy = py - this.y;
			if (dx * dx + dy * dy <= FREEZE_RADIUS * FREEZE_RADIUS) {
				this.onFreezePlayer?.();
			}
		}
	}

	override render(ctx: CanvasRenderingContext2D): void {
		super.render(ctx);
		if (!this.exploding) {
			ctx.save();
			ctx.beginPath();
			ctx.arc(this.x, this.y, FREEZE_RADIUS, 0, Math.PI * 2);
			ctx.strokeStyle = 'rgba(120, 220, 255, 0.25)';
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.fillStyle = 'rgba(80, 180, 255, 0.08)';
			ctx.fill();
			ctx.restore();
		}
	}

	updateMovement(dt: number): void {
		switch (this.phase) {
			case 'entering': {
				this.y -= ENTER_SPEED * dt;
				if (this.y <= STOP_Y) {
					this.y = STOP_Y;
					this.phase = 'waiting';
				}
				break;
			}
			case 'waiting': {
				this.waitTimer += dt;
				if (this.waitTimer >= WAIT_DURATION) this.phase = 'leaving';
				break;
			}
			case 'leaving': {
				this.leavingSpeed = Math.min(
					LEAVE_SPEED,
					this.leavingSpeed + LEAVE_SPEED * 3 * dt
				);
				this.y -= this.leavingSpeed * dt;
				break;
			}
		}
	}
}
