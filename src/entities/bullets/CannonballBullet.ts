import { BaseBullet, IBullet } from '../Bullet';
import { Spritesheet } from '../../utils/Spritesheet';
import { RiceBullet } from './RiceBullet';
import { OvalLaserBullet } from './OvalLaserBullet';
import { ShockwaveBullet } from './ShockwaveBullet';
import { SoundManager, SFX } from '../../systems/SoundManager';

export interface CannonballConfig {
	angle: number;
	lifetime: number;
	speed: number;
	helixInterval: number;
	helixBaseAngle: number;
	helixAngleStep: number;
	helixCount: number;
	helixInitSpeed: number;
	helixTargetSpeed: number;
	helixAccelDelay: number;
	helixAccelDuration: number;
	laserCount: number;
	laserSpeed: number;
	laserAngleOffset: number;
}

const CANNONBALL_SIZE = 16;
const EXPLOSION_W = 80;
const EXPLOSION_H = 80;
const EXPLOSION_FRAMES = 8;
const EXPLOSION_FRAME_SPEED = 0.05;

export class CannonballBullet extends BaseBullet {
	private cannonSheet: Spritesheet;
	private explosionSheet?: Spritesheet;
	private cfg: CannonballConfig;

	private helixTimer: number = 0;
	private helixShots: number = 0;
	private lifeTimer: number = 0;

	private exploded: boolean = false;

	constructor(x: number, y: number, cfg: CannonballConfig) {
		super(
			x,
			y,
			Math.cos(cfg.angle) * cfg.speed,
			Math.sin(cfg.angle) * cfg.speed,
			CANNONBALL_SIZE,
			CANNONBALL_SIZE
		);
		this.cfg = cfg;
		this.cannonSheet = new Spritesheet({
			src: 'assets/sprites/bullets/hostile/cannonball.png',
			frameX: CANNONBALL_SIZE,
			frameY: CANNONBALL_SIZE,
			frameCount: 1,
			frameSpeed: 1,
			looping: true,
		});
		this.hitRadius = CANNONBALL_SIZE / 2 - 2;
	}

	override update(dt: number): void {
		if (this.exploded) {
			this.updateExplosion(dt);
			return;
		}

		this.helixTimer += dt;
		while (this.helixTimer >= this.cfg.helixInterval) {
			this.helixTimer -= this.cfg.helixInterval;
			this.fireHelixShot();
		}

		this.x += this.vx * dt;
		this.y += this.vy * dt;

		this.lifeTimer += dt;
		if (this.lifeTimer >= this.cfg.lifetime) {
			this.startExplosion();
		}
	}

	private fireHelixShot(): void {
		const baseAngle =
			this.cfg.helixBaseAngle + this.helixShots * this.cfg.helixAngleStep;
		const count = this.cfg.helixCount;
		if (!this.pendingSpawns) this.pendingSpawns = [];
		for (let i = 0; i < count; i++) {
			const angle = baseAngle + (i / count) * Math.PI * 2;
			const rice = new RiceBullet(
				this.x,
				this.y,
				Math.cos(angle) * this.cfg.helixInitSpeed,
				Math.sin(angle) * this.cfg.helixInitSpeed,
				'orange'
			);
			rice.setupSpeedProfile(angle, this.cfg.helixInitSpeed, [
				{
					targetSpeed: this.cfg.helixInitSpeed,
					duration: this.cfg.helixAccelDelay,
				},
				{
					targetSpeed: this.cfg.helixTargetSpeed,
					duration: this.cfg.helixAccelDuration,
				},
			]);
			this.pendingSpawns.push(rice as IBullet);
		}
		this.helixShots++;
	}

	private startExplosion(): void {
		this.exploded = true;
		this.vx = 0;
		this.vy = 0;
		this.hitRadius = 0;
		SoundManager.play(SFX.CANNONBALL_EXPLODE);
		this.explosionSheet = new Spritesheet({
			src: 'assets/sprites/effects/cannonfire.png',
			frameX: EXPLOSION_W,
			frameY: EXPLOSION_H,
			frameCount: EXPLOSION_FRAMES,
			frameSpeed: EXPLOSION_FRAME_SPEED,
			looping: false,
		});
		this.fireLaserCircle();
		if (!this.pendingSpawns) this.pendingSpawns = [];
		this.pendingSpawns.push(
			new ShockwaveBullet(this.x, this.y, 'orange') as IBullet
		);
	}

	private fireLaserCircle(): void {
		const count = this.cfg.laserCount;
		if (count <= 0) return;
		if (!this.pendingSpawns) this.pendingSpawns = [];
		for (let i = 0; i < count; i++) {
			const angle = this.cfg.laserAngleOffset + (i / count) * Math.PI * 2;
			this.pendingSpawns.push(
				new OvalLaserBullet(
					this.x,
					this.y,
					Math.cos(angle) * this.cfg.laserSpeed,
					Math.sin(angle) * this.cfg.laserSpeed,
					'orange'
				) as IBullet
			);
		}
	}

	private updateExplosion(dt: number): void {
		this.explosionSheet?.update(dt);
		if (this.explosionSheet?.isFinished()) {
			this.active = false;
		}
	}

	override render(ctx: CanvasRenderingContext2D): void {
		if (this.exploded) {
			if (this.explosionSheet) {
				this.explosionSheet.draw(
					ctx,
					this.x - EXPLOSION_W / 2,
					this.y - EXPLOSION_H / 2,
					EXPLOSION_W,
					EXPLOSION_H
				);
			}
			return;
		}
		this.cannonSheet.draw(
			ctx,
			this.x - CANNONBALL_SIZE / 2,
			this.y - CANNONBALL_SIZE / 2,
			CANNONBALL_SIZE,
			CANNONBALL_SIZE
		);
	}
}
