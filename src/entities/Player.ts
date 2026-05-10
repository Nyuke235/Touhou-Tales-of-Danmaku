import { Controls } from '../systems/Controls';
import { InputManager } from '../systems/InputManager';
import { BulletManager } from '../systems/BulletManager';
import { SoundManager, SFX } from '../systems/SoundManager';
import { Spritesheet, createExplosionSheet } from '../utils/Spritesheet';
import { IBullet } from './Bullet';
import { GameState } from '../game/GameState';
import { IOption } from './Power';
import { FIELD, PLAYER } from '../game/Constants';

export interface PlayerConfig {
	spriteSrc: string;
	frameCount: number;
	speed: number;
	focusSpeed: number;
	createProjectiles: (x: number, y: number) => IBullet[];
	createOption: (index: number) => IOption;
	optionOffsets: [number, number][][];
	optionFocusOffsets: [number, number][][];
}

export class Player {
	x: number;
	y: number;
	width: number = 32;
	height: number = 32;

	hitboxRadius: number = 1;

	private speed: number;
	private config: PlayerConfig;
	private inputManager: InputManager;
	private bulletManager: BulletManager;
	private sheet: Spritesheet;
	private explSheet: Spritesheet;
	private shootTimer: number = 0;

	private dying: boolean = false;
	private deadTimer: number = 0;

	private invincible: boolean = false;
	private invincibleTimer: number = 0;
	private blinkTimer: number = 0;
	private visible: boolean = true;

	private frozenTimer: number = 0;

	private options: IOption[] = [];
	getNearestEnemy:
		| ((x: number, y: number) => { x: number; y: number } | null)
		| null = null;

	constructor(
		inputManager: InputManager,
		bulletManager: BulletManager,
		config: PlayerConfig
	) {
		this.inputManager = inputManager;
		this.bulletManager = bulletManager;
		this.config = config;
		this.speed = config.speed;
		this.x = PLAYER.SPAWN_X;
		this.y = PLAYER.SPAWN_Y;

		this.sheet = new Spritesheet({
			src: config.spriteSrc,
			frameX: 32,
			frameY: 32,
			frameCount: config.frameCount,
			frameSpeed: 0.08,
		});

		this.explSheet = createExplosionSheet();
	}

	update(dt: number): void {
		if (this.dying) {
			this.explSheet.update(dt);
			if (this.explSheet.isFinished()) {
				this.dying = false;
				this.deadTimer = PLAYER.DEAD_DURATION;
			}
			return;
		}

		if (this.deadTimer > 0) {
			this.deadTimer -= dt;
			if (this.deadTimer <= 0) {
				this.x = PLAYER.SPAWN_X;
				this.y = PLAYER.SPAWN_Y;
				this.invincible = true;
				this.invincibleTimer = PLAYER.INVINCIBLE_DURATION;
				this.blinkTimer = PLAYER.BLINK_INTERVAL;
				this.visible = true;
			}
			return;
		}

		const focused = this.inputManager.isHeld(Controls.FOCUS);
		this.handleMovement(dt, focused);
		this.handleShooting(dt, focused);
		this.handleInvincibility(dt);
		this.handleOptions(dt, focused);
		this.sheet.update(dt);
	}

	isVulnerable(): boolean {
		return (
			!this.invincible &&
			!this.dying &&
			this.deadTimer <= 0 &&
			!GameState.debugInvincible
		);
	}

	isDead(): boolean {
		return this.dying || this.deadTimer > 0;
	}

	checkCollisions(enemyBullets: IBullet[]): boolean {
		if (
			GameState.debugInvincible ||
			this.invincible ||
			this.dying ||
			this.deadTimer > 0
		)
			return false;

		for (const p of enemyBullets) {
			if (!p.active || p.isShadow) continue;
			const dx = p.x - this.x;
			const dy = p.y - this.y;
			if (dx * dx + dy * dy <= (this.hitboxRadius + p.hitRadius) ** 2) {
				return true;
			}

			if (p.checkTrailHit?.(this.x, this.y, this.hitboxRadius)) {
				return true;
			}
		}
		return false;
	}

	checkGraze(enemyBullets: IBullet[]): number {
		if (
			this.invincible ||
			this.dying ||
			this.deadTimer > 0 ||
			GameState.debugInvincible
		)
			return 0;

		let count = 0;
		for (const p of enemyBullets) {
			if (!p.active || p.isShadow || p.grazed) continue;
			const dx = p.x - this.x;
			const dy = p.y - this.y;
			const grazeR = PLAYER.GRAZE_RADIUS + p.hitRadius;
			if (dx * dx + dy * dy <= grazeR * grazeR) {
				p.grazed = true;
				count++;
			}
		}
		return count;
	}

	hit(): void {
		if (
			GameState.debugInvincible ||
			this.invincible ||
			this.dying ||
			this.deadTimer > 0
		)
			return;
		this.dying = true;
		this.visible = false;
		this.explSheet.reset();
		SoundManager.play(SFX.PLAYER_DEATH);
	}

	private handleShooting(dt: number, focused: boolean): void {
		this.shootTimer -= dt;
		if (!this.inputManager.isHeld(Controls.SHOOT)) return;
		if (this.shootTimer > 0) return;

		this.shootTimer = PLAYER.SHOOT_COOLDOWN;
		this.shoot(focused);
	}

	private shoot(focused: boolean): void {
		for (const p of this.config.createProjectiles(this.x, this.y)) {
			this.bulletManager.addPlayerProjectile(p);
		}

		if (this.getNearestEnemy) {
			for (const option of this.options) {
				option.shoot(this.bulletManager, this.getNearestEnemy, this.x, focused);
			}
		}

		SoundManager.play(SFX.PLAYER_SHOOT);
	}

	freeze(duration: number): void {
		this.frozenTimer = Math.max(this.frozenTimer, duration);
	}

	isFrozen(): boolean {
		return this.frozenTimer > 0;
	}

	private handleMovement(dt: number, focused: boolean): void {
		if (this.frozenTimer > 0) this.frozenTimer -= dt;
		const freezeMult = this.frozenTimer > 0 ? 0.32 : 1.0;
		this.speed =
			(focused ? this.config.focusSpeed : this.config.speed) * freezeMult;

		let dx = 0;
		let dy = 0;

		if (this.inputManager.isHeld(Controls.MOVE_LEFT)) dx -= 1;
		if (this.inputManager.isHeld(Controls.MOVE_RIGHT)) dx += 1;
		if (this.inputManager.isHeld(Controls.MOVE_UP)) dy -= 1;
		if (this.inputManager.isHeld(Controls.MOVE_DOWN)) dy += 1;

		if (dx !== 0 && dy !== 0) {
			dx *= PLAYER.DIAGONAL_FACTOR;
			dy *= PLAYER.DIAGONAL_FACTOR;
		}

		this.x += dx * this.speed * dt;
		this.y += dy * this.speed * dt;

		const hw = this.width / 2;
		const hh = this.height / 2;
		this.x = Math.max(hw, Math.min(FIELD.WIDTH - hw, this.x));
		this.y = Math.max(hh, Math.min(FIELD.HEIGHT - hh, this.y));
	}

	private handleOptions(dt: number, focused: boolean): void {
		const target = Math.min(4, Math.floor(GameState.power));

		while (this.options.length < target) {
			this.options.push(this.config.createOption(this.options.length));
		}
		while (this.options.length > target) {
			this.options.pop();
		}

		const offsets = focused
			? this.config.optionFocusOffsets[target]
			: this.config.optionOffsets[target];
		for (let i = 0; i < this.options.length; i++) {
			this.options[i].x = this.x + offsets[i][0];
			this.options[i].y = this.y + offsets[i][1];
			this.options[i].update(dt);
		}
	}

	private handleInvincibility(dt: number): void {
		if (!this.invincible) return;

		this.invincibleTimer -= dt;
		this.blinkTimer -= dt;

		if (this.blinkTimer <= 0) {
			this.visible = !this.visible;
			this.blinkTimer = PLAYER.BLINK_INTERVAL;
		}

		if (this.invincibleTimer <= 0) {
			this.invincible = false;
			this.visible = true;
		}
	}

	render(ctx: CanvasRenderingContext2D, focused: boolean): void {
		if (this.dying) {
			this.explSheet.draw(ctx, this.x - 40, this.y - 40, 80, 80);
			return;
		}

		if (this.deadTimer > 0) return;

		if (!this.visible) return;

		for (const option of this.options) option.render(ctx);

		this.sheet.draw(
			ctx,
			this.x - this.width / 2,
			this.y - this.height / 2,
			this.width,
			this.height
		);

		if (focused) {
			const L = 12;
			const W = 1.2;
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.shadowColor = 'rgba(0, 247, 255, 1)';
			ctx.shadowBlur = 4;
			ctx.fillStyle = 'rgba(0, 247, 255, 1)';
			for (let i = 0; i < 4; i++) {
				ctx.rotate(Math.PI / 2);
				ctx.beginPath();
				ctx.moveTo(0, -L);
				ctx.lineTo(-W, 0);
				ctx.lineTo(W, 0);
				ctx.closePath();
				ctx.fill();
			}
			ctx.shadowBlur = 0;
			ctx.restore();
			this.renderHitbox(ctx);
		}
	}

	renderHitbox(ctx: CanvasRenderingContext2D): void {
		if (this.dying || this.deadTimer > 0 || !this.visible) return;
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.hitboxRadius, 0, Math.PI * 2);
		ctx.shadowColor = 'rgba(0, 247, 255, 1)';
		ctx.shadowBlur = 6;
		ctx.fillStyle = 'rgb(0, 129, 180)';
		ctx.fill();
		ctx.strokeStyle = 'rgb(255, 255, 255)';
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.restore();
	}
}
