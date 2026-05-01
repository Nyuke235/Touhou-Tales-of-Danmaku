import { Spritesheet } from '../utils/Spritesheet';
import { IBullet } from './Bullet';
import { PatternConfig } from '../game/patterns/PatternEngine';
import { Enemy } from './Enemy';
import { ItemType } from './Item';
import { SoundManager, SFX } from '../systems/SoundManager';
import { BOSS as B, BOSS_ENTRY, FIELD } from '../game/Constants';

export interface BossPhase {
	name: string;
	isSpellCard: boolean;
	hp: number;
	timer: number;
	barWeight: number;
	patterns: PatternConfig[];
	drops?: { type: ItemType; count: number }[];
}

export const BossState = {
	ENTRY: 'ENTRY',
	ACTIVE: 'ACTIVE',
	PHASE_HURT: 'PHASE_HURT',
	PHASE_MOVING: 'PHASE_MOVING',
	PHASE_WAITING: 'PHASE_WAITING',
	DYING_DIALOGUE: 'DYING_DIALOGUE',
	DYING_HURT: 'DYING_HURT',
	DYING_WAITING: 'DYING_WAITING',
	DYING_LEAVING: 'DYING_LEAVING',
} as const;

export type BossState = (typeof BossState)[keyof typeof BossState];

const DEST_WAIT = B.DEST_WAIT;
const LEAVE_SPEED = B.LEAVE_SPEED;
const HURT_SIZE = B.HURT_SIZE;
const CENTER_X = B.CENTER_X;
const CENTER_Y = B.CENTER_Y;
const RETURN_LERP = B.RETURN_LERP;
const PHASE_WAIT = B.PHASE_WAIT;
const FTM_LERP = 2.5;

export abstract class Boss extends Enemy {
	private static readonly shadowImg: HTMLImageElement = (() => {
		const img = new Image();
		img.src = 'assets/sprites/effects/shadow.png';
		return img;
	})();

	protected phases: BossPhase[];
	protected currentPhaseIndex: number = 0;
	protected phaseHP: number;
	protected phaseTimer: number;
	protected isMoving: boolean = false;

	protected state: BossState = BossState.ENTRY;

	protected entered: boolean = false;
	protected charging: boolean = false;
	protected chargeSheet: Spritesheet;

	protected ftmMoving: boolean = false;
	protected ftmMoveDir: number = 1;
	protected ftmMoveTarget: number = CENTER_X;

	protected idleSheet: Spritesheet;
	protected movingSheet: Spritesheet;
	private hurtSheet: Spritesheet;

	private phaseWaitTimer: number = 0;
	private deathWaitTimer: number = 0;
	private dialogueWaitTimer: number = 0;
	private static readonly POST_DIALOGUE_DELAY = 1.5;
	private nextPhaseIsSpellCard: boolean = false;
	private lastTimeoutTick: number = 10;

	music?: string;
	dialogueId: string = '';

	requestClearWithEffect: boolean = false;
	spellcardBgSrc?: string;
	onArrived?: () => void;
	onReady?: () => void;
	onPhaseChange?: () => void;
	onPhaseDrops?: (drops: { type: ItemType; count: number }[]) => void;
	onSpellCapture?: (bonus: number) => void;
	onDefeated?: () => void;

	private spellBonus: number = 0;
	private spellCaptureFailed: boolean = false;
	private static readonly SPELL_BONUS_INITIAL = B.SPELL_BONUS_INITIAL;
	private static readonly SPELL_BONUS_DECAY = B.SPELL_BONUS_DECAY;

	startCharge(): void {
		this.charging = true;
		SoundManager.play(SFX.BOSS_CHARGE);
	}

	beginLeave(): void {
		this.state = BossState.DYING_LEAVING;
	}

	protected completeEntry(): void {
		this.state = BossState.ACTIVE;
		this.onReady?.();
	}

	protected handleEntryAndCharge(dt: number): boolean {
		if (!this.entered) {
			this.y += BOSS_ENTRY.ENTRY_SPEED * dt;
			this.isMoving = false;
			if (this.y >= CENTER_Y) {
				this.y = CENTER_Y;
				this.entered = true;
				if (this.onArrived) {
					this.onArrived();
				} else {
					this.startCharge();
				}
			}
			return true;
		}
		if (this.charging) {
			this.chargeSheet.update(dt);
			if (this.chargeSheet.isFinished()) {
				this.charging = false;
				this.completeEntry();
			}
			return true;
		}
		return false;
	}

	protected handleFtmMovement(
		dt: number,
		driftOffset: number,
		shouldMove: boolean,
		onTrigger?: () => void,
		onSnap?: () => void
	): void {
		if (this.ftmMoving) {
			const dx = this.ftmMoveTarget - this.x;
			const dy = CENTER_Y - this.y;
			this.x += dx * FTM_LERP * dt;
			this.y += dy * BOSS_ENTRY.FTM_Y_LERP * dt;
			this.isMoving = Math.abs(dx) > 3;
			if (Math.abs(dx) < 3 && Math.abs(dy) < 3) {
				this.x = this.ftmMoveTarget;
				this.y = CENTER_Y;
				this.isMoving = false;
				this.ftmMoving = false;
				onSnap?.();
			}
		} else {
			const dx = CENTER_X - this.x;
			const dy = CENTER_Y - this.y;
			if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
				this.x += dx * BOSS_ENTRY.RETURN_LERP * dt;
				this.y += dy * BOSS_ENTRY.RETURN_LERP * dt;
			}
			this.isMoving = false;
			if (this.state === BossState.ACTIVE && shouldMove) {
				this.ftmMoving = true;
				this.ftmMoveDir = -this.ftmMoveDir;
				this.ftmMoveTarget = CENTER_X + this.ftmMoveDir * driftOffset;
				onTrigger?.();
			}
		}
	}

	skipToPhase(index: number): void {
		if (index <= 0 || index >= this.phases.length) return;
		this.currentPhaseIndex = index;
		const phase = this.phases[index];
		this.phaseHP = phase.hp;
		this.phaseTimer = phase.timer;
		this.lastTimeoutTick = 10;
		this.setPatterns(phase.patterns);
		if (phase.isSpellCard) {
			this.spellBonus = Boss.SPELL_BONUS_INITIAL;
			this.spellCaptureFailed = false;
		} else {
			this.spellBonus = 0;
		}
	}

	forceKill(): void {
		this.explode();
	}

	failSpellCapture(): void {
		this.spellCaptureFailed = true;
	}
	getSpellBonus(): number {
		return Math.floor(this.spellBonus / 10_000) * 10_000;
	}
	isCaptureFailed(): boolean {
		return this.spellCaptureFailed;
	}

	receiveBombDamage(damage: number): void {
		if (this.state !== BossState.ACTIVE) return;
		this.phaseHP -= damage;
		SoundManager.play(SFX.ENEMY_HIT);
		if (this.phaseHP <= 0) this.nextPhase(true);
	}

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		idleSheet: Spritesheet,
		movingSheet: Spritesheet,
		explSheet: Spritesheet,
		phases: BossPhase[]
	) {
		super(x, y, width, height, phases[0].hp, idleSheet, explSheet);
		this.idleSheet = idleSheet;
		this.movingSheet = movingSheet;
		this.phases = phases;
		this.phaseHP = phases[0].hp;
		this.phaseTimer = phases[0].timer;
		this.setPatterns(phases[0].patterns);

		this.chargeSheet = new Spritesheet({
			src: 'assets/sprites/effects/bosscharge.png',
			frameX: 64,
			frameY: 64,
			frameCount: 9,
			frameSpeed: 0.07,
			looping: false,
		});

		this.hurtSheet = new Spritesheet({
			src: 'assets/sprites/effects/bosshurt.png',
			frameX: 48,
			frameY: 48,
			frameCount: 7,
			frameSpeed: 0.08,
			looping: false,
		});
	}

	getSpellSepFill(): number | null {
		if (this.currentPhaseIndex >= this.phases.length) return null;

		let lifeStart = this.currentPhaseIndex;
		while (lifeStart > 0 && this.phases[lifeStart].isSpellCard) lifeStart--;

		let lifeEnd = lifeStart + 1;
		while (lifeEnd < this.phases.length && this.phases[lifeEnd].isSpellCard)
			lifeEnd++;

		const spellCount = lifeEnd - lifeStart - 1;
		return spellCount > 0 ? 0.25 : null;
	}

	getBarFill(): number {
		if (this.currentPhaseIndex >= this.phases.length) return 0;

		let lifeStart = this.currentPhaseIndex;
		while (lifeStart > 0 && this.phases[lifeStart].isSpellCard) lifeStart--;

		let lifeEnd = lifeStart + 1;
		while (lifeEnd < this.phases.length && this.phases[lifeEnd].isSpellCard)
			lifeEnd++;

		const spellCount = lifeEnd - lifeStart - 1;
		const spellWeight = spellCount > 0 ? 0.25 / spellCount : 0;
		const normWeight = spellCount > 0 ? 0.75 : 1.0;

		let fill = 0;
		for (let i = this.currentPhaseIndex + 1; i < lifeEnd; i++) {
			fill += this.phases[i].isSpellCard ? spellWeight : normWeight;
		}
		const curWeight = this.phases[this.currentPhaseIndex].isSpellCard
			? spellWeight
			: normWeight;
		fill +=
			(Math.max(0, this.phaseHP) / this.phases[this.currentPhaseIndex].hp) *
			curWeight;

		return Math.max(0, Math.min(1, fill));
	}

	getCurrentPhaseName(): string {
		if (this.currentPhaseIndex >= this.phases.length) return '';
		return this.phases[this.currentPhaseIndex].name;
	}

	isCurrentSpellCard(): boolean {
		if (this.currentPhaseIndex >= this.phases.length) return false;
		return this.phases[this.currentPhaseIndex].isSpellCard;
	}

	getTimer(): number {
		return Math.max(0, Math.ceil(this.phaseTimer));
	}

	isDying(): boolean {
		return (
			this.state === BossState.DYING_DIALOGUE ||
			this.state === BossState.DYING_HURT ||
			this.state === BossState.DYING_WAITING ||
			this.state === BossState.DYING_LEAVING
		);
	}

	isInTransition(): boolean {
		return (
			this.state === BossState.PHASE_HURT ||
			this.state === BossState.PHASE_MOVING ||
			this.state === BossState.PHASE_WAITING
		);
	}

	protected allPatternsDone(): boolean {
		return (
			this.engines.length > 0 &&
			this.engines.every((e, i) => e.isDone(this.patterns[i]))
		);
	}

	protected resetPatternEngines(): void {
		for (const e of this.engines) e.reset();
	}

	protected nextPhase(beaten: boolean = true): boolean {
		const phase = this.phases[this.currentPhaseIndex];
		if (phase.drops) this.onPhaseDrops?.(phase.drops);

		if (
			beaten &&
			phase.isSpellCard &&
			!this.spellCaptureFailed &&
			this.spellBonus > 0
		) {
			this.onSpellCapture?.(this.getSpellBonus());
		}

		this.currentPhaseIndex++;

		if (this.currentPhaseIndex >= this.phases.length) {
			this.explode();
			return true;
		}

		SoundManager.play(SFX.PHASE_DEFEATED);

		const nextPhaseData = this.phases[this.currentPhaseIndex];
		this.phaseHP = nextPhaseData.hp;
		this.phaseTimer = nextPhaseData.timer;
		this.lastTimeoutTick = 10;
		this.setPatterns(nextPhaseData.patterns);
		this.nextPhaseIsSpellCard = nextPhaseData.isSpellCard;

		if (nextPhaseData.isSpellCard) {
			this.spellBonus = Boss.SPELL_BONUS_INITIAL;
			this.spellCaptureFailed = false;
		} else {
			this.spellBonus = 0;
		}

		this.state = BossState.PHASE_HURT;
		this.hurtSheet.reset();
		this.requestClearWithEffect = true;

		this.onPhaseChange?.();
		return false;
	}

	protected override explode(): void {
		for (const e of this.engines) e.reset();
		this.requestClearWithEffect = true;
		this.state = BossState.DYING_HURT;
		this.hurtSheet.reset();
		SoundManager.play(SFX.BOSS_DEFEATED);
		this.onDeath?.();
	}

	override checkCollisions(playerBullets: IBullet[]): {
		hits: number;
		killed: boolean;
		damage: number;
	} {
		if (this.state !== BossState.ACTIVE)
			return { hits: 0, killed: false, damage: 0 };

		let hits = 0;
		let damage = 0;
		for (const p of playerBullets) {
			if (!p.active) continue;
			if (
				p.x > this.x - this.width / 2 &&
				p.x < this.x + this.width / 2 &&
				p.y > this.y - this.height / 2 &&
				p.y < this.y + this.height / 2
			) {
				p.active = false;
				this.phaseHP -= p.damage;
				damage += p.damage;
				hits++;

				if (this.phaseHP <= 0) {
					const died = this.nextPhase(true);
					if (hits > 0) SoundManager.play(SFX.ENEMY_HIT);
					return { hits, killed: died, damage };
				}
			}
		}
		if (hits > 0) SoundManager.play(SFX.ENEMY_HIT);
		return { hits, killed: false, damage };
	}

	override scaleHealth(factor: number): void {
		for (const phase of this.phases) {
			phase.hp = Math.round(phase.hp * factor);
		}
		this.phaseHP = this.phases[this.currentPhaseIndex].hp;
		this.health = this.phaseHP;
	}

	override getNetHp(): number {
		return this.phaseHP;
	}

	override getNetPhase(): number {
		return this.currentPhaseIndex;
	}

	override applyNetState(hp: number, phase?: number): void {
		if (this.isDying()) return;

		if (
			phase !== undefined &&
			phase > this.currentPhaseIndex &&
			!this.isInTransition()
		) {
			this.nextPhase(true);
			return;
		}

		if (this.state === BossState.ACTIVE) {
			this.phaseHP = hp;
			if (hp <= 0) this.nextPhase(true);
		}
	}

	override update(
		dt: number,
		px: number,
		py: number,
		enemyBullets: IBullet[]
	): void {
		if (this.isDying()) {
			this.updateDying(dt);
			return;
		}

		if (this.isInTransition()) {
			this.updateTransition(dt);
			return;
		}

		if (this.state === BossState.ACTIVE) {
			this.phaseTimer -= dt;
			if (this.phaseTimer <= 0) {
				this.nextPhase(false);
				return;
			}

			if (this.phaseTimer <= this.lastTimeoutTick && this.lastTimeoutTick > 0) {
				this.lastTimeoutTick--;
				SoundManager.play(SFX.TIMEOUT);
			}

			if (this.isCurrentSpellCard() && !this.spellCaptureFailed) {
				this.spellBonus = Math.max(
					0,
					this.spellBonus - Boss.SPELL_BONUS_DECAY * dt
				);
			}
		}

		const prevX = this.x;
		this.updateMovement(dt);
		if (this.x !== prevX) this.facingLeft = this.x < prevX;
		this.tickActiveSheet(dt);

		if (
			this.state === BossState.ACTIVE &&
			this.x > 0 &&
			this.x < FIELD.WIDTH &&
			this.y > 0 &&
			this.y < FIELD.HEIGHT
		) {
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
				SoundManager.play(SFX.BOSS_SHOT);
			}
		}
	}

	private updateDying(dt: number): void {
		if (this.state === BossState.DYING_HURT) {
			this.hurtSheet.update(dt);
			if (this.hurtSheet.isFinished()) {
				if (this.onDefeated) {
					this.state = BossState.DYING_DIALOGUE;
					this.dialogueWaitTimer = Boss.POST_DIALOGUE_DELAY;
				} else {
					this.state = BossState.DYING_WAITING;
					this.deathWaitTimer = DEST_WAIT;
				}
			}
		} else if (this.state === BossState.DYING_DIALOGUE) {
			this.tickActiveSheet(dt);
			if (this.dialogueWaitTimer > 0) {
				this.dialogueWaitTimer -= dt;
				if (this.dialogueWaitTimer <= 0) {
					this.dialogueWaitTimer = 0;
					this.onDefeated?.();
				}
			}
		} else if (this.state === BossState.DYING_WAITING) {
			this.deathWaitTimer -= dt;
			if (this.deathWaitTimer <= 0) {
				this.state = BossState.DYING_LEAVING;
			}
		} else if (this.state === BossState.DYING_LEAVING) {
			this.y -= LEAVE_SPEED * dt;
			this.tickActiveSheet(dt);
			if (this.y < -60) this.active = false;
		}
	}

	private updateTransition(dt: number): void {
		if (this.state === BossState.PHASE_HURT) {
			this.hurtSheet.update(dt);
			this.tickActiveSheet(dt);
			if (this.hurtSheet.isFinished()) {
				this.state = BossState.PHASE_MOVING;
			}
		} else if (this.state === BossState.PHASE_MOVING) {
			const dx = CENTER_X - this.x;
			const dy = CENTER_Y - this.y;
			this.x += dx * RETURN_LERP * dt;
			this.y += dy * RETURN_LERP * dt;
			this.isMoving = Math.abs(dx) > 3;
			this.facingLeft = dx < 0;
			this.tickActiveSheet(dt);

			if (Math.abs(dx) < 3 && Math.abs(dy) < 3) {
				this.x = CENTER_X;
				this.y = CENTER_Y;
				this.isMoving = false;
				this.state = BossState.PHASE_WAITING;
				this.phaseWaitTimer = PHASE_WAIT;
				if (this.nextPhaseIsSpellCard) SoundManager.play(SFX.SPELLCARD);
			}
		} else if (this.state === BossState.PHASE_WAITING) {
			this.tickActiveSheet(dt);
			this.phaseWaitTimer -= dt;
			if (this.phaseWaitTimer <= 0) {
				this.state = BossState.ACTIVE;
			}
		}
	}

	private tickActiveSheet(dt: number): void {
		if (this.isMoving) {
			this.movingSheet.update(dt);
		} else {
			this.idleSheet.update(dt);
		}
	}

	override render(ctx: CanvasRenderingContext2D): void {
		const sw = 100;
		ctx.save();
		ctx.globalAlpha = 0.5;
		ctx.drawImage(Boss.shadowImg, this.x - sw / 2, this.y - sw / 2, sw, sw);
		ctx.restore();

		ctx.save();
		if (this.facingLeft) {
			ctx.translate(this.x * 2, 0);
			ctx.scale(-1, 1);
		}
		const sheet = this.isMoving ? this.movingSheet : this.idleSheet;
		sheet.draw(
			ctx,
			this.x - this.width / 2,
			this.y - this.height / 2,
			this.width,
			this.height
		);
		ctx.restore();

		if (
			this.state === BossState.PHASE_HURT ||
			this.state === BossState.DYING_HURT
		) {
			this.hurtSheet.draw(
				ctx,
				this.x - HURT_SIZE / 2,
				this.y - HURT_SIZE / 2,
				HURT_SIZE,
				HURT_SIZE
			);
		}

		if (this.charging) {
			this.chargeSheet.draw(ctx, this.x - 32, this.y - 32, 64, 64);
		}
	}
}
