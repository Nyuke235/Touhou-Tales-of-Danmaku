import { BaseBullet, IBullet } from '../Bullet';
import { Spritesheet } from '../../utils/Spritesheet';
import { makeSheet, ORB_SPRITES, STAR_SPRITES } from './BulletSprites';

const ORB_SIZE = 24;
const STAR_SIZE = 16;
const ORB_SPIN = 2.0;
const STAR_SPIN = 3.0;

export class DelayedRadialStar extends BaseBullet {
	private sheet: Spritesheet;
	private rotation: number = 0;
	private waitTimer: number = 0;
	private readonly activationDelay: number;
	private readonly finalSpeed: number;
	private readonly accelDuration: number;
	private readonly radialAngle: number;
	private activated: boolean = false;

	constructor(
		x: number,
		y: number,
		cx: number,
		cy: number,
		activationDelay: number,
		finalSpeed: number,
		accelDuration: number
	) {
		super(x, y, 0, 0, STAR_SIZE, STAR_SIZE);
		this.sheet = makeSheet(
			STAR_SPRITES.yellow ?? 'assets/sprites/bullets/hostile/staryellow.png',
			STAR_SIZE,
			STAR_SIZE
		);
		this.activationDelay = activationDelay;
		this.finalSpeed = finalSpeed;
		this.accelDuration = accelDuration;
		const dx = x - cx;
		const dy = y - cy;
		this.radialAngle = Math.atan2(dy, dx);
		this.hitRadius = STAR_SIZE / 2 - 2;
	}

	override update(dt: number): void {
		this.rotation += STAR_SPIN * dt;
		if (!this.activated) {
			this.waitTimer += dt;
			if (this.waitTimer >= this.activationDelay) {
				this.activated = true;
				this.setupSpeedProfile(this.radialAngle, 0, [
					{ targetSpeed: this.finalSpeed, duration: this.accelDuration },
				]);
			}
			return;
		}
		super.update(dt);
	}

	override render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		this.sheet.draw(ctx, -STAR_SIZE / 2, -STAR_SIZE / 2, STAR_SIZE, STAR_SIZE);
		ctx.restore();
	}
}

export class SheddingOrbBullet extends BaseBullet {
	private sheet: Spritesheet;
	private rotation: number = 0;
	private readonly centerX: number;
	private readonly centerY: number;
	private orbitAngle: number;
	private radius: number = 0;
	private readonly angularVel: number;
	private readonly radialVel: number;
	private shedTimer: number = 0;
	private shedCount: number = 0;
	private readonly shedInterval: number;
	private readonly maxSheds: number;
	private readonly starActivationDelay: number;
	private readonly starSpeed: number;
	private readonly starAccelDuration: number;

	constructor(
		cx: number,
		cy: number,
		angle: number,
		angularVel: number,
		radialVel: number,
		shedInterval: number,
		maxSheds: number,
		starActivationDelay: number,
		starSpeed: number,
		starAccelDuration: number
	) {
		super(cx, cy, 0, 0, ORB_SIZE, ORB_SIZE);
		this.sheet = makeSheet(
			ORB_SPRITES.yellow ?? 'assets/sprites/bullets/hostile/orbyellow.png',
			ORB_SIZE,
			ORB_SIZE
		);
		this.centerX = cx;
		this.centerY = cy;
		this.orbitAngle = angle;
		this.angularVel = angularVel;
		this.radialVel = radialVel;
		this.shedInterval = shedInterval;
		this.maxSheds = maxSheds;
		this.starActivationDelay = starActivationDelay;
		this.starSpeed = starSpeed;
		this.starAccelDuration = starAccelDuration;
		this.hitRadius = ORB_SIZE / 2 - 2;
	}

	override update(dt: number): void {
		this.orbitAngle += this.angularVel * dt;
		this.radius += this.radialVel * dt;
		this.rotation += ORB_SPIN * dt;
		this.x = this.centerX + Math.cos(this.orbitAngle) * this.radius;
		this.y = this.centerY + Math.sin(this.orbitAngle) * this.radius;

		this.shedTimer += dt;
		while (
			this.shedTimer >= this.shedInterval &&
			this.shedCount < this.maxSheds
		) {
			this.shedTimer -= this.shedInterval;
			const star = new DelayedRadialStar(
				this.x,
				this.y,
				this.centerX,
				this.centerY,
				this.starActivationDelay,
				this.starSpeed,
				this.starAccelDuration
			);
			if (!this.pendingSpawns) this.pendingSpawns = [];
			this.pendingSpawns.push(star as IBullet);
			this.shedCount++;
		}

		if (this.shedCount >= this.maxSheds) {
			this.active = false;
			return;
		}

		const hw = this.width / 2;
		const hh = this.height / 2;
		if (
			this.x + hw < 0 ||
			this.x - hw > BaseBullet.FIELD_W ||
			this.y + hh < 0 ||
			this.y - hh > BaseBullet.FIELD_H
		) {
			this.active = false;
		}
	}

	override render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.shadowColor = 'rgba(255, 220, 100, 0.7)';
		ctx.shadowBlur = 12;
		this.sheet.draw(ctx, -ORB_SIZE / 2, -ORB_SIZE / 2, ORB_SIZE, ORB_SIZE);
		ctx.restore();
	}
}

export class DelayedDirectionalStar extends BaseBullet {
	private sheet: Spritesheet;
	private rotation: number = 0;
	private waitTimer: number = 0;
	private readonly activationDelay: number;
	private readonly finalSpeed: number;
	private readonly accelDuration: number;
	private readonly finalAngle: number;
	private activated: boolean = false;

	constructor(
		x: number,
		y: number,
		finalAngle: number,
		activationDelay: number,
		finalSpeed: number,
		accelDuration: number
	) {
		super(x, y, 0, 0, STAR_SIZE, STAR_SIZE);
		this.sheet = makeSheet(
			STAR_SPRITES.yellow ?? 'assets/sprites/bullets/hostile/staryellow.png',
			STAR_SIZE,
			STAR_SIZE
		);
		this.activationDelay = activationDelay;
		this.finalSpeed = finalSpeed;
		this.accelDuration = accelDuration;
		this.finalAngle = finalAngle;
		this.hitRadius = STAR_SIZE / 2 - 2;
	}

	override update(dt: number): void {
		this.rotation += STAR_SPIN * dt;
		if (!this.activated) {
			this.waitTimer += dt;
			if (this.waitTimer >= this.activationDelay) {
				this.activated = true;
				this.setupSpeedProfile(this.finalAngle, 0, [
					{ targetSpeed: this.finalSpeed, duration: this.accelDuration },
				]);
			}
			return;
		}
		super.update(dt);
	}

	override render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		this.sheet.draw(ctx, -STAR_SIZE / 2, -STAR_SIZE / 2, STAR_SIZE, STAR_SIZE);
		ctx.restore();
	}
}

export class SweepSheddingOrbBullet extends BaseBullet {
	private sheet: Spritesheet;
	private rotation: number = 0;
	private readonly centerX: number;
	private readonly centerY: number;
	private orbitAngle: number;
	private radius: number = 0;
	private readonly angularVel: number;
	private readonly radialVel: number;
	private shedTimer: number = 0;
	private shedCount: number = 0;
	private readonly shedInterval: number;
	private readonly maxSheds: number;
	private readonly starActivationDelay: number;
	private readonly starSpeed: number;
	private readonly starAccelDuration: number;
	private readonly starBaseAngle: number;
	private readonly starAngleStep: number;

	constructor(
		cx: number,
		cy: number,
		angle: number,
		angularVel: number,
		radialVel: number,
		shedInterval: number,
		maxSheds: number,
		starActivationDelay: number,
		starSpeed: number,
		starAccelDuration: number,
		starBaseAngle: number,
		starAngleStep: number
	) {
		super(cx, cy, 0, 0, ORB_SIZE, ORB_SIZE);
		this.sheet = makeSheet(
			ORB_SPRITES.yellow ?? 'assets/sprites/bullets/hostile/orbyellow.png',
			ORB_SIZE,
			ORB_SIZE
		);
		this.centerX = cx;
		this.centerY = cy;
		this.orbitAngle = angle;
		this.angularVel = angularVel;
		this.radialVel = radialVel;
		this.shedInterval = shedInterval;
		this.maxSheds = maxSheds;
		this.starActivationDelay = starActivationDelay;
		this.starSpeed = starSpeed;
		this.starAccelDuration = starAccelDuration;
		this.starBaseAngle = starBaseAngle;
		this.starAngleStep = starAngleStep;
		this.hitRadius = ORB_SIZE / 2 - 2;
	}

	override update(dt: number): void {
		this.orbitAngle += this.angularVel * dt;
		this.radius += this.radialVel * dt;
		this.rotation += ORB_SPIN * dt;
		this.x = this.centerX + Math.cos(this.orbitAngle) * this.radius;
		this.y = this.centerY + Math.sin(this.orbitAngle) * this.radius;

		this.shedTimer += dt;
		while (
			this.shedTimer >= this.shedInterval &&
			this.shedCount < this.maxSheds
		) {
			this.shedTimer -= this.shedInterval;
			const finalAngle =
				this.starBaseAngle + this.shedCount * this.starAngleStep;
			const star = new DelayedDirectionalStar(
				this.x,
				this.y,
				finalAngle,
				this.starActivationDelay,
				this.starSpeed,
				this.starAccelDuration
			);
			if (!this.pendingSpawns) this.pendingSpawns = [];
			this.pendingSpawns.push(star as IBullet);
			this.shedCount++;
		}

		if (this.shedCount >= this.maxSheds) {
			this.active = false;
			return;
		}

		const hw = this.width / 2;
		const hh = this.height / 2;
		if (
			this.x + hw < 0 ||
			this.x - hw > BaseBullet.FIELD_W ||
			this.y + hh < 0 ||
			this.y - hh > BaseBullet.FIELD_H
		) {
			this.active = false;
		}
	}

	override render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.shadowColor = 'rgba(255, 220, 100, 0.7)';
		ctx.shadowBlur = 12;
		this.sheet.draw(ctx, -ORB_SIZE / 2, -ORB_SIZE / 2, ORB_SIZE, ORB_SIZE);
		ctx.restore();
	}
}
