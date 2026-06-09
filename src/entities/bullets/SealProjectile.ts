import { Spritesheet } from '../../utils/Spritesheet';
import { SoundManager, SFX } from '../../systems/SoundManager';
import { Enemy } from '../Enemy';
import { FIELD } from '../../game/Constants';

export type SealColor = 'red' | 'blue' | 'green';

const SPRITES: Record<SealColor, string> = {
	red: 'assets/sprites/bullets/player/sealred.png',
	blue: 'assets/sprites/bullets/player/sealblue.png',
	green: 'assets/sprites/bullets/player/sealgreen.png',
};

const GLOW_COLORS: Record<SealColor, string> = {
	red: 'rgba(255,80,80,0.9)',
	blue: 'rgba(80,160,255,0.9)',
	green: 'rgba(120,255,140,0.9)',
};

const FULL_SIZE = 22;
const GROW_DURATION = 0.35;
const SEEK_SPEED = 420;
const HIT_RADIUS = 10;
const EXPLODE_DURATION = 0.35;
const EXPLODE_MAX_RADIUS = 26;
const OFFSCREEN_MARGIN = 40;
export const SEAL_DAMAGE = 20;

type SealState = 'grow' | 'orbit' | 'seek' | 'exploding' | 'done';

export class SealProjectile {
	x: number = 0;
	y: number = 0;
	color: SealColor;
	state: SealState = 'grow';

	private sheet: Spritesheet;
	private growElapsed: number = 0;
	orbitAngle: number;
	orbitRadius: number = 30;

	private target: Enemy | null = null;
	private targetX: number = 0;
	private targetY: number = 0;
	private hitApplied: boolean = false;

	private explodeElapsed: number = 0;
	private explodeX: number = 0;
	private explodeY: number = 0;

	constructor(color: SealColor, orbitAngle: number) {
		this.color = color;
		this.orbitAngle = orbitAngle;
		this.sheet = new Spritesheet({
			src: SPRITES[color],
			frameX: 64,
			frameY: 64,
			frameCount: 1,
			frameSpeed: 1,
			looping: true,
		});
	}

	updateOrbit(
		dt: number,
		reimuX: number,
		reimuY: number,
		angularVel: number
	): void {
		if (this.state === 'grow') {
			this.growElapsed += dt;
			this.orbitAngle += angularVel * dt;
			this.x = reimuX + Math.cos(this.orbitAngle) * this.orbitRadius;
			this.y = reimuY + Math.sin(this.orbitAngle) * this.orbitRadius;
			if (this.growElapsed >= GROW_DURATION) this.state = 'orbit';
		} else if (this.state === 'orbit') {
			this.orbitAngle += angularVel * dt;
			this.x = reimuX + Math.cos(this.orbitAngle) * this.orbitRadius;
			this.y = reimuY + Math.sin(this.orbitAngle) * this.orbitRadius;
		}
	}

	updateSeek(
		dt: number,
		applyDamage: (target: Enemy, damage: number) => void
	): void {
		if (this.state === 'seek') {
			if (this.target && this.target.active && !this.target.isDying()) {
				this.targetX = this.target.x;
				this.targetY = this.target.y;
			} else if (this.target) {
				this.target = null;
				this.targetX = this.x;
				this.targetY = -OFFSCREEN_MARGIN * 2;
			}

			const dx = this.targetX - this.x;
			const dy = this.targetY - this.y;
			const dist = Math.hypot(dx, dy);

			if (this.target && dist < HIT_RADIUS) {
				applyDamage(this.target, SEAL_DAMAGE);
				this.hitApplied = true;
				this.beginExplode();
				return;
			}

			if (dist > 0.001) {
				const step = SEEK_SPEED * dt;
				if (step >= dist) {
					this.x = this.targetX;
					this.y = this.targetY;
				} else {
					this.x += (dx / dist) * step;
					this.y += (dy / dist) * step;
				}
			}

			if (
				this.x < -OFFSCREEN_MARGIN ||
				this.x > FIELD.WIDTH + OFFSCREEN_MARGIN ||
				this.y < -OFFSCREEN_MARGIN ||
				this.y > FIELD.HEIGHT + OFFSCREEN_MARGIN
			) {
				this.state = 'done';
			}
		} else if (this.state === 'exploding') {
			this.explodeElapsed += dt;
			if (this.explodeElapsed >= EXPLODE_DURATION) this.state = 'done';
		}
	}

	launch(target: Enemy | null): void {
		this.target = target;
		if (target) {
			this.targetX = target.x;
			this.targetY = target.y;
		} else {
			this.targetX = this.x;
			this.targetY = -OFFSCREEN_MARGIN * 2;
		}
		this.state = 'seek';
	}

	private beginExplode(): void {
		this.state = 'exploding';
		this.explodeElapsed = 0;
		this.explodeX = this.x;
		this.explodeY = this.y;
		SoundManager.play(SFX.PLAYER_SEAL);
	}

	isOrbiting(): boolean {
		return this.state === 'orbit';
	}

	isDone(): boolean {
		return this.state === 'done';
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.state === 'done') return;

		if (this.state === 'exploding') {
			const t = this.explodeElapsed / EXPLODE_DURATION;
			const radius = EXPLODE_MAX_RADIUS * t;
			const alpha = Math.max(0, 1 - t);
			ctx.save();
			ctx.globalAlpha = alpha;
			ctx.shadowColor = GLOW_COLORS[this.color];
			ctx.shadowBlur = 14;
			ctx.fillStyle = GLOW_COLORS[this.color];
			ctx.beginPath();
			ctx.arc(this.explodeX, this.explodeY, radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.shadowBlur = 0;
			ctx.globalAlpha = alpha * 0.9;
			ctx.fillStyle = '#ffffff';
			ctx.beginPath();
			ctx.arc(this.explodeX, this.explodeY, radius * 0.45, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
			return;
		}

		let size = FULL_SIZE;
		if (this.state === 'grow') {
			const t = Math.min(1, this.growElapsed / GROW_DURATION);
			size = FULL_SIZE * t;
		}
		if (size < 1) return;

		ctx.save();
		ctx.shadowColor = GLOW_COLORS[this.color];
		ctx.shadowBlur = 8;
		this.sheet.draw(ctx, this.x - size / 2, this.y - size / 2, size, size);
		ctx.restore();
	}

	hadHit(): boolean {
		return this.hitApplied;
	}
}
