import { Boss, BossPhase, BossState } from '../../Boss';
import { Spritesheet, createExplosionSheet } from '../../../utils/Spritesheet';
import { Music } from '../../../systems/MusicManager';
import { Patterns } from '../../../patterns/PatternLibrary';
import { IBullet } from '../../Bullet';
import { LanternBullet } from '../../bullets/LanternBullet';
import { BallBullet } from '../../bullets/BallBullet';
import { GameState, Difficulty } from '../../../game/GameState';
import { FIELD } from '../../../game/Constants';

const PHASES: BossPhase[] = [
	{
		name: '',
		isSpellCard: false,
		hp: 300,
		timer: 35,
		barWeight: 0.3,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'life', count: 1 },
		],
		patterns: [
			Patterns.RUMIA_STARWHEEL,
			Patterns.RUMIA_STARWHEEL_CCW,
			Patterns.RUMIA_JELLYBEAN_SPIRAL_1,
			Patterns.RUMIA_JELLYBEAN_SPIRAL_2,
			Patterns.RUMIA_JELLYBEAN_SPIRAL_3,
			Patterns.RUMIA_JELLYBEAN_SPIRAL_4,
			Patterns.RUMIA_ORB_RINGS_E,
			Patterns.RUMIA_ORB_RINGS_NH,
			Patterns.RUMIA_ORB_RINGS_L,
		],
	},
	{
		name: 'Dark Sign 「Demarcation」',
		isSpellCard: true,
		hp: 300,
		timer: 40,
		barWeight: 0.2,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [
			Patterns.RUMIA_WHEEL_CW_EASY,
			Patterns.RUMIA_WHEEL_CCW_EASY,
			Patterns.RUMIA_WHEEL_CW,
			Patterns.RUMIA_WHEEL_CCW,
			Patterns.RUMIA_WHEEL_CW_2,
			Patterns.RUMIA_WHEEL_CCW_2,
			Patterns.RUMIA_SHADOW_AIMED,
			Patterns.RUMIA_ORB_RINGS_PURPLE_1,
			Patterns.RUMIA_ORB_RINGS_PURPLE_2,
		],
	},
	{
		name: '',
		isSpellCard: false,
		hp: 300,
		timer: 35,
		barWeight: 0.25,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'life', count: 1 },
		],
		patterns: [
			Patterns.RUMIA_SHEDDING_ORB_E,
			Patterns.RUMIA_SHEDDING_ORB_N,
			Patterns.RUMIA_SHEDDING_ORB_H,
			Patterns.RUMIA_SHEDDING_ORB_L,
			Patterns.RUMIA_SHEDDING_ORB_N_CCW,
			Patterns.RUMIA_SHEDDING_ORB_H_CCW,
			Patterns.RUMIA_SHEDDING_ORB_L_CCW,
			Patterns.RUMIA_SHEDDING_ORB_SWEEP_E,
			Patterns.RUMIA_SHEDDING_ORB_SWEEP_N,
			Patterns.RUMIA_SHEDDING_ORB_SWEEP_H,
			Patterns.RUMIA_SHEDDING_ORB_SWEEP_L,
			Patterns.RUMIA_SPECTRAL_COMET,
			Patterns.RUMIA_SPECTRAL_COMET_CCW,
			Patterns.RUMIA_SPECTRAL_COMET_EASY,
			Patterns.RUMIA_ORB_RINGS_YELLOW_1,
			Patterns.RUMIA_ORB_RINGS_YELLOW_2,
		],
	},
	{
		name: 'Night Sign 「Abyss Mandala」',
		isSpellCard: true,
		hp: 425,
		timer: 45,
		barWeight: 0.25,
		drops: [
			{ type: 'bigpoint', count: 4 },
			{ type: 'power', count: 10 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [],
	},
];

const DRIFT_OFFSET = 50;
const DRIFT_OFFSET_P2 = 70;
const DRIFT_OFFSET_P3 = 55;
const DRIFT_OFFSET_P4 = 65;

const P4_MAX_DARK_RADIUS = 220;
const P4_LANTERN_INTERVAL = 3.0;
const P4_RISE_INTERVAL = 1.5;

export class Rumia extends Boss {
	private p2FireTimer: number = 0;
	private static readonly P2_MOVE_INTERVAL = 9.0;
	private p3FireTimer: number = 0;
	private static readonly P3_MOVE_INTERVAL = 7.0;
	private p4FireTimer: number = 0;
	private static readonly P4_MOVE_INTERVAL = 2.5;

	private p4Started: boolean = false;
	private p4DarkRadius: number = 0;
	private p4LanternTimer: number = 0;
	private p4RiseTimer: number = 0;
	private activeLanterns: LanternBullet[] = [];
	private overlayCanvas: HTMLCanvasElement | null = null;

	constructor(x: number, y: number) {
		const idleSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/rumia/rumia.png',
			frameX: 32,
			frameY: 32,
			frameCount: 1,
			frameSpeed: 1,
			looping: true,
		});
		const movingSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/rumia/rumiamoving.png',
			frameX: 32,
			frameY: 32,
			frameCount: 1,
			frameSpeed: 1,
			looping: true,
		});
		const explSheet = createExplosionSheet();

		super(x, y, 32, 32, idleSheet, movingSheet, explSheet, PHASES);

		this.scoreValue = 80000;
		this.music = Music.BOSS;
		this.dialogueId = 'rumia';
	}

	override update(
		dt: number,
		px: number,
		py: number,
		enemyBullets: IBullet[]
	): void {
		super.update(dt, px, py, enemyBullets);
		if (this.state === BossState.ACTIVE && this.currentPhaseIndex === 3) {
			this.updatePhase4(dt, enemyBullets);
		}
	}

	private updatePhase4(dt: number, enemyBullets: IBullet[]): void {
		if (!this.p4Started) {
			this.p4Started = true;
			this.p4DarkRadius = 0;
			this.p4LanternTimer = 0;
			this.p4RiseTimer = 0;
			this.activeLanterns = [];
			this.spawnLanterns(enemyBullets);
		}

		if (this.p4DarkRadius < P4_MAX_DARK_RADIUS) {
			this.p4DarkRadius = Math.min(
				P4_MAX_DARK_RADIUS,
				this.p4DarkRadius + P4_MAX_DARK_RADIUS * dt
			);
		}

		this.p4LanternTimer += dt;
		if (this.p4LanternTimer >= P4_LANTERN_INTERVAL) {
			this.p4LanternTimer -= P4_LANTERN_INTERVAL;
			this.spawnLanterns(enemyBullets);
		}

		this.p4RiseTimer += dt;
		if (this.p4RiseTimer >= P4_RISE_INTERVAL) {
			this.p4RiseTimer -= P4_RISE_INTERVAL;
			this.spawnRisingBalls(enemyBullets);
		}

		this.activeLanterns = this.activeLanterns.filter(l => l.active);
	}

	private getLanternConfig(): { count: number; speed: number } {
		switch (GameState.difficulty) {
			case Difficulty.EASY:
				return {
					count: Patterns.RUMIA_P4_LANTERN_SHOT_E?.count ?? 8,
					speed: Patterns.RUMIA_P4_LANTERN_SHOT_E?.speed ?? 45,
				};
			case Difficulty.HARD:
				return {
					count: Patterns.RUMIA_P4_LANTERN_SHOT_H?.count ?? 12,
					speed: Patterns.RUMIA_P4_LANTERN_SHOT_H?.speed ?? 58,
				};
			case Difficulty.LUNATIC:
				return {
					count: Patterns.RUMIA_P4_LANTERN_SHOT_L?.count ?? 16,
					speed: Patterns.RUMIA_P4_LANTERN_SHOT_L?.speed ?? 68,
				};
			default:
				return {
					count: Patterns.RUMIA_P4_LANTERN_SHOT_N?.count ?? 10,
					speed: Patterns.RUMIA_P4_LANTERN_SHOT_N?.speed ?? 50,
				};
		}
	}

	private getRisingBallConfig(): {
		count: number;
		speed: number;
		drift: number;
	} {
		switch (GameState.difficulty) {
			case Difficulty.EASY:
				return {
					count: Patterns.RUMIA_P4_RISING_E?.count ?? 5,
					speed: Patterns.RUMIA_P4_RISING_E?.speed ?? 50,
					drift: 15,
				};
			case Difficulty.HARD:
				return {
					count: Patterns.RUMIA_P4_RISING_H?.count ?? 7,
					speed: Patterns.RUMIA_P4_RISING_H?.speed ?? 62,
					drift: 25,
				};
			case Difficulty.LUNATIC:
				return {
					count: Patterns.RUMIA_P4_RISING_L?.count ?? 8,
					speed: Patterns.RUMIA_P4_RISING_L?.speed ?? 72,
					drift: 30,
				};
			default:
				return {
					count: Patterns.RUMIA_P4_RISING_N?.count ?? 6,
					speed: Patterns.RUMIA_P4_RISING_N?.speed ?? 55,
					drift: 20,
				};
		}
	}

	private spawnLanterns(enemyBullets: IBullet[]): void {
		const cfg = this.getLanternConfig();
		const count = 1;
		for (let i = 0; i < count; i++) {
			const x = 20 + Math.random() * (FIELD.WIDTH - 40);
			const lantern = new LanternBullet(x, -24, cfg.count, cfg.speed);
			enemyBullets.push(lantern);
			this.activeLanterns.push(lantern);
		}
	}

	private spawnRisingBalls(enemyBullets: IBullet[]): void {
		const cfg = this.getRisingBallConfig();
		for (let i = 0; i < cfg.count; i++) {
			const x = 10 + Math.random() * (FIELD.WIDTH - 20);
			const vx = (Math.random() - 0.5) * 2 * cfg.drift;
			enemyBullets.push(
				new BallBullet(x, FIELD.HEIGHT + 10, vx, -cfg.speed, 'purple')
			);
		}
	}

	override renderOverlay(
		ctx: CanvasRenderingContext2D,
		w: number,
		h: number
	): void {
		if (
			this.currentPhaseIndex !== 3 ||
			!this.p4Started ||
			this.p4DarkRadius <= 0
		)
			return;

		if (
			!this.overlayCanvas ||
			this.overlayCanvas.width !== w ||
			this.overlayCanvas.height !== h
		) {
			this.overlayCanvas = document.createElement('canvas');
			this.overlayCanvas.width = w;
			this.overlayCanvas.height = h;
		}

		const off = this.overlayCanvas.getContext('2d')!;
		off.clearRect(0, 0, w, h);

		off.fillStyle = 'black';
		off.beginPath();
		off.arc(w / 2, h / 2, this.p4DarkRadius, 0, Math.PI * 2);
		off.fill();

		off.globalCompositeOperation = 'destination-out';
		for (const lantern of this.activeLanterns) {
			if (!lantern.active) continue;
			const r = LanternBullet.LIGHT_RADIUS;
			const grad = off.createRadialGradient(
				lantern.x,
				lantern.y,
				0,
				lantern.x,
				lantern.y,
				r
			);
			grad.addColorStop(0, 'rgba(0,0,0,1)');
			grad.addColorStop(0.55, 'rgba(0,0,0,0.85)');
			grad.addColorStop(1, 'rgba(0,0,0,0)');
			off.fillStyle = grad;
			off.beginPath();
			off.arc(lantern.x, lantern.y, r, 0, Math.PI * 2);
			off.fill();
		}
		off.globalCompositeOperation = 'source-over';

		ctx.drawImage(this.overlayCanvas, 0, 0);

		for (const lantern of this.activeLanterns) {
			if (!lantern.active) continue;
			const r = LanternBullet.LIGHT_RADIUS;
			ctx.save();
			const glow = ctx.createRadialGradient(
				lantern.x,
				lantern.y,
				0,
				lantern.x,
				lantern.y,
				r
			);
			glow.addColorStop(0, 'rgba(255, 200, 80, 0.22)');
			glow.addColorStop(0.4, 'rgba(255, 140, 30, 0.10)');
			glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
			ctx.fillStyle = glow;
			ctx.beginPath();
			ctx.arc(lantern.x, lantern.y, r, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
	}

	updateMovement(dt: number): void {
		if (this.handleEntryAndCharge(dt)) return;

		const driftOffset =
			this.currentPhaseIndex === 1
				? DRIFT_OFFSET_P2
				: this.currentPhaseIndex === 2
					? DRIFT_OFFSET_P3
					: this.currentPhaseIndex === 3
						? DRIFT_OFFSET_P4
						: DRIFT_OFFSET;

		let shouldMove = false;
		if (!this.ftmMoving && this.state === BossState.ACTIVE) {
			const isSpellCard =
				this.phases[this.currentPhaseIndex]?.isSpellCard ?? false;
			const isP3 = this.currentPhaseIndex === 2;
			const isP4 = this.currentPhaseIndex === 3;
			shouldMove = isP4
				? (this.p4FireTimer += dt) >= Rumia.P4_MOVE_INTERVAL
				: isSpellCard
					? (this.p2FireTimer += dt) >= Rumia.P2_MOVE_INTERVAL
					: isP3
						? (this.p3FireTimer += dt) >= Rumia.P3_MOVE_INTERVAL
						: this.allPatternsDone();
		}

		this.handleFtmMovement(dt, driftOffset, shouldMove, () => {
			this.p2FireTimer = 0;
			this.p3FireTimer = 0;
			this.p4FireTimer = 0;
			this.resetPatternEngines();
		});
	}
}
