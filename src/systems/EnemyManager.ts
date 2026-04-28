import { Enemy } from '../entities/Enemy';
import { Boss } from '../entities/Boss';
import { SpawnEvent } from '../game/StageScript';
import { IBullet } from '../entities/Bullet';
import { ItemType } from '../entities/Item';
import { ScoreManager } from './ScoreManager';
import { FIELD } from '../game/Constants';

const WARNING_DURATION = 1.5;
const WARNING_SIZE = 32;
const BLINK_INTERVAL = 0.15;

type ItemDrop = { type: ItemType; count: number };

export class EnemyManager {
	private enemies: Enemy[] = [];
	private script: SpawnEvent[] = [];
	private stageTimer: number = 0;
	private eventIndex: number = 0;
	private activeBoss: Boss | null = null;

	killedCount: number = 0;
	hpMultiplier: number = 1;
	private stageCompleted: boolean = false;
	private spawnCounter: number = 0;

	private warnings: { x: number; timer: number }[] = [];
	private warnIndex: number = 0;
	private warningImage: HTMLImageElement = new Image();
	private warningImageReady: boolean = false;

	onBossSpawn?: (boss: Boss) => void;
	onStageComplete?: () => void;
	onDrop: (x: number, y: number, drops: ItemDrop[]) => void = () => {};
	onScore: (value: number) => void = () => {};
	onEnemyDamage?: (spawnId: number, damage: number) => void;
	onFreezePlayer?: () => void;

	constructor() {
		this.warningImage.src = 'assets/sprites/effects/warning.png';
		this.warningImage.onload = () => {
			this.warningImageReady = true;
		};
	}

	loadScript(script: SpawnEvent[]): void {
		this.script = [...script].sort((a, b) => a.time - b.time);
		this.stageTimer = 0;
		this.eventIndex = 0;
		this.enemies = [];
		this.killedCount = 0;
		this.activeBoss = null;
		this.stageCompleted = false;
		this.spawnCounter = 0;
		this.warnings = [];
		this.warnIndex = 0;
	}

	update(
		dt: number,
		px: number,
		py: number,
		playerBullets: IBullet[],
		enemyBullets: IBullet[]
	): void {
		if (this.activeBoss && !this.activeBoss.active) {
			this.activeBoss = null;
		}
		if (!this.activeBoss) {
			this.stageTimer += dt;
		}

		while (
			this.warnIndex < this.script.length &&
			this.script[this.warnIndex].time - this.stageTimer <= WARNING_DURATION
		) {
			const evt = this.script[this.warnIndex];
			if (evt.spawnY !== undefined && evt.spawnY > FIELD.HEIGHT) {
				this.warnings.push({ x: evt.spawnX ?? FIELD.WIDTH / 2, timer: 0 });
			}
			this.warnIndex++;
		}

		for (const w of this.warnings) w.timer += dt;
		this.warnings = this.warnings.filter(w => w.timer < WARNING_DURATION);

		while (
			this.eventIndex < this.script.length &&
			this.script[this.eventIndex].time <= this.stageTimer
		) {
			const enemy = this.script[this.eventIndex].factory();
			if (this.hpMultiplier !== 1) enemy.scaleHealth(this.hpMultiplier);

			enemy.spawnId = this.spawnCounter++;
			enemy.onDeath = () => {
				this.onDrop(enemy.x, enemy.y, enemy.drops);
			};
			enemy.onFreezePlayer = this.onFreezePlayer;

			this.enemies.push(enemy);
			if (enemy instanceof Boss) {
				this.activeBoss = enemy;
				enemy.onPhaseDrops = drops => {
					this.onDrop(enemy.x, enemy.y, drops);
				};
				this.onBossSpawn?.(enemy);
			}
			this.eventIndex++;
		}

		for (const e of this.enemies) {
			e.update(dt, px, py, enemyBullets);
			const { hits, killed, damage } = e.checkCollisions(playerBullets);
			if (hits > 0) this.onScore(ScoreManager.HIT * hits);
			if (damage > 0) this.onEnemyDamage?.(e.spawnId, damage);
			if (killed) {
				this.onScore(e.scoreValue);
				this.killedCount++;
			}
		}

		this.enemies = this.enemies.filter(e => e.active);

		if (
			!this.stageCompleted &&
			this.script.length > 0 &&
			this.eventIndex >= this.script.length &&
			this.enemies.length === 0 &&
			!this.activeBoss
		) {
			this.stageCompleted = true;
			this.onStageComplete?.();
		}
	}

	checkBodyCollisions(
		px: number,
		py: number,
		hitRadius: number,
		vulnerable: boolean
	): boolean {
		if (!vulnerable) return false;
		let hit = false;
		for (const e of this.enemies) {
			if (!e.active || e.isDying()) continue;
			const closestX = Math.max(
				e.x - e.width / 2,
				Math.min(px, e.x + e.width / 2)
			);
			const closestY = Math.max(
				e.y - e.height / 2,
				Math.min(py, e.y + e.height / 2)
			);
			const dx = px - closestX;
			const dy = py - closestY;
			if (dx * dx + dy * dy <= hitRadius * hitRadius) {
				hit = true;
				if (!(e instanceof Boss)) {
					e.kill();
					this.onScore(e.scoreValue);
				}
			}
		}
		return hit;
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.warningImageReady) {
			for (const w of this.warnings) {
				if (Math.floor(w.timer / BLINK_INTERVAL) % 2 === 0) {
					ctx.drawImage(
						this.warningImage,
						w.x - WARNING_SIZE / 2,
						FIELD.HEIGHT - WARNING_SIZE,
						WARNING_SIZE,
						WARNING_SIZE
					);
				}
			}
		}
		for (const e of this.enemies) e.render(ctx);
	}

	getEnemies(): Enemy[] {
		return this.enemies;
	}

	getNearestEnemy(x: number, y: number): { x: number; y: number } | null {
		let nearest: Enemy | null = null;
		let minDist = Infinity;
		for (const e of this.enemies) {
			if (!e.active) continue;
			const dx = e.x - x;
			const dy = e.y - y;
			const dist = dx * dx + dy * dy;
			if (dist < minDist) {
				minDist = dist;
				nearest = e;
			}
		}
		return nearest ? { x: nearest.x, y: nearest.y } : null;
	}

	applyBomb(damage: number): void {
		for (const e of this.enemies) {
			if (!e.active || e.isDying()) continue;
			if (e instanceof Boss) {
				e.receiveBombDamage(damage);
			} else {
				e.kill();
				this.onScore(e.scoreValue);
				this.killedCount++;
			}
		}
	}

	clear(): void {
		this.enemies = [];
		this.eventIndex = 0;
		this.stageTimer = 0;
		this.activeBoss = null;
		this.stageCompleted = false;
		this.spawnCounter = 0;
		this.warnings = [];
		this.warnIndex = 0;
	}

	getNetSnapshot(): {
		id: number;
		hp: number;
		dead: boolean;
		phase?: number;
	}[] {
		return this.enemies.map(e => ({
			id: e.spawnId,
			hp: e.getNetHp(),
			dead: e.isDying() || !e.active,
			phase: e.getNetPhase(),
		}));
	}

	applyGuestDamage(spawnId: number, damage: number): void {
		const e = this.enemies.find(en => en.spawnId === spawnId);
		if (!e || e.isDying() || !e.active) return;
		const newHp = e.getNetHp() - damage;
		e.applyNetState(newHp, e.getNetPhase());
		if (newHp <= 0) {
			this.onScore(e.scoreValue);
			this.killedCount++;
		}
	}

	applyNetSnapshot(
		snapshot: { id: number; hp: number; dead: boolean; phase?: number }[]
	): void {
		for (const s of snapshot) {
			const e = this.enemies.find(en => en.spawnId === s.id);
			if (!e || e.isDying() || !e.active) continue;
			if (s.dead) {
				e.kill();
			} else {
				e.applyNetState(s.hp, s.phase);
			}
		}
	}
}
