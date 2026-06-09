import { Spritesheet } from '../utils/Spritesheet';
import { type IBullet } from './Bullet';
import { PatternEngine, PatternConfig } from '../patterns/PatternEngine';
import { GameState } from '../game/GameState';
import { ItemType } from './Item';
import { SoundManager, SFX } from '../systems/SoundManager';
import { FIELD, ENEMY } from '../game/Constants';

export abstract class Enemy {
	x: number;
	y: number;
	width: number;
	height: number;
	active: boolean = true;

	protected health: number;
	protected sheet: Spritesheet;
	protected explSheet: Spritesheet;
	protected exploding: boolean = false;
	protected facingLeft: boolean = false;
	private hitFlash: boolean = false;

	protected patterns: PatternConfig[] = [];
	protected engines: PatternEngine[] = [];

	drops: { type: ItemType; count: number }[] = [];
	scoreValue: number = 1000;
	spawnId: number = 0;

	protected static readonly FIELD_W = FIELD.WIDTH;
	protected static readonly FIELD_H = FIELD.HEIGHT;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		health: number,
		sheet: Spritesheet,
		explSheet: Spritesheet
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.health = health;
		this.sheet = sheet;
		this.explSheet = explSheet;
	}

	protected setPatterns(patterns: PatternConfig[]): void {
		this.patterns = patterns;
		this.engines = patterns.map(() => new PatternEngine(GameState.difficulty));
	}

	abstract updateMovement(dt: number): void;

	update(dt: number, px: number, py: number, enemyBullets: IBullet[]): void {
		this.hitFlash = false;
		if (this.exploding) {
			this.explSheet.update(dt);
			if (this.explSheet.isFinished()) {
				this.active = false;
			}
			return;
		}

		const prevX = this.x;
		this.updateMovement(dt);
		if (this.x !== prevX) this.facingLeft = this.x < prevX;
		this.sheet.update(dt);
		this.checkOutOfBounds();

		if (this.isInField()) {
			const prevCount = enemyBullets.length;
			for (let i = 0; i < this.patterns.length; i++) {
				this.engines[i].update(
					dt,
					this.patterns[i],
					this.x,
					this.y,
					px,
					py,
					enemyBullets
				);
			}
			if (enemyBullets.length > prevCount) {
				SoundManager.play(this.shotSFX());
			}
		}
	}

	private isInField(): boolean {
		return (
			this.x > 0 &&
			this.x < Enemy.FIELD_W &&
			this.y > 0 &&
			this.y < Enemy.FIELD_H
		);
	}

	private checkOutOfBounds(): void {
		const margin = ENEMY.OOB_MARGIN;
		if (
			this.x + this.width / 2 < -margin ||
			this.x - this.width / 2 > Enemy.FIELD_W + margin ||
			this.y + this.height / 2 < -margin ||
			this.y - this.height / 2 > Enemy.FIELD_H + margin
		) {
			this.active = false;
		}
	}

	checkCollisions(playerBullets: IBullet[]): {
		hits: number;
		killed: boolean;
		damage: number;
	} {
		if (this.exploding) return { hits: 0, killed: false, damage: 0 };

		let hits = 0;
		let damage = 0;
		for (const p of playerBullets) {
			if (!p.active) continue;
			if (this.hits(p)) {
				p.active = false;
				this.health -= p.damage;
				damage += p.damage;
				hits++;
				if (this.health <= 0) {
					this.explode();
					return { hits, killed: true, damage };
				}
			}
		}
		if (hits > 0) {
			SoundManager.play(SFX.ENEMY_HIT);
			this.hitFlash = true;
		}
		return { hits, killed: false, damage };
	}

	private hits(p: IBullet): boolean {
		return (
			p.x > this.x - this.width / 2 &&
			p.x < this.x + this.width / 2 &&
			p.y > this.y - this.height / 2 &&
			p.y < this.y + this.height / 2
		);
	}

	isDying(): boolean {
		return this.exploding;
	}

	scaleHealth(factor: number): void {
		this.health = Math.round(this.health * factor);
	}

	getNetHp(): number {
		return this.health;
	}

	getNetPhase(): number | undefined {
		return undefined;
	}

	applyNetState(hp: number, _phase?: number): void {
		if (this.exploding) return;
		this.health = hp;
		if (hp <= 0) this.explode();
	}

	kill(): void {
		if (!this.exploding) this.explode();
	}

	applyDirectDamage(damage: number): boolean {
		if (this.exploding) return false;
		this.health -= damage;
		this.hitFlash = true;
		if (this.health <= 0) {
			this.explode();
			return true;
		}
		SoundManager.play(SFX.ENEMY_HIT);
		return false;
	}

	protected shotSFX(): string {
		return SFX.ENEMY_SHOT;
	}

	protected explode(): void {
		this.exploding = true;
		this.explSheet.reset();
		SoundManager.play(SFX.ENEMY_DEATH);

		for (const e of this.engines) e.reset();
		this.onDeath?.();
	}

	onDeath?: () => void;
	onFreezePlayer?: () => void;

	render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		if (this.hitFlash) ctx.globalAlpha = 0.2;
		if (this.facingLeft) {
			ctx.translate(this.x * 2, 0);
			ctx.scale(-1, 1);
		}

		if (this.exploding) {
			this.explSheet.draw(
				ctx,
				this.x - this.width / 2,
				this.y - this.height / 2,
				this.width,
				this.height
			);
		} else {
			this.sheet.draw(
				ctx,
				this.x - this.width / 2,
				this.y - this.height / 2,
				this.width,
				this.height
			);
		}

		ctx.restore();
	}
}
