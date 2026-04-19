import { Boss, BossPhase, BossState } from '../../Boss';
import { Spritesheet, createExplosionSheet } from '../../../utils/Spritesheet';
import { SoundManager, SFX } from '../../../systems/SoundManager';
import { Music } from '../../../systems/MusicManager';
import { Patterns } from '../../../game/patterns/PatternLibrary';
import { BOSS, BOSS_ENTRY } from '../../../game/Constants';

const PHASES: BossPhase[] = [
	{
		name: '',
		isSpellCard: false,
		hp: 300,
		timer: 30,
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
		timer: 35,
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
			Patterns.RUMIA_ORB_RINGS_PURPLE,
		],
	},
	{
		name: '',
		isSpellCard: false,
		hp: 300,
		timer: 30,
		barWeight: 0.25,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'life', count: 1 },
		],
		patterns: [
			Patterns.RUMIA_STARWHEEL_LOOP,
			Patterns.RUMIA_VOLLEY_HARD,
			Patterns.RUMIA_VOLLEY_LUNATIC,
			Patterns.RUMIA_SPECTRAL_COMET,
			Patterns.RUMIA_SPECTRAL_COMET_CCW,
			Patterns.RUMIA_SPECTRAL_COMET_EASY,
		],
	},
	{
		name: 'Night Sign 「Abyss Mandala」',
		isSpellCard: true,
		hp: 300,
		timer: 35,
		barWeight: 0.25,
		drops: [
			{ type: 'bigpoint', count: 4 },
			{ type: 'power', count: 10 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [
			Patterns.RUMIA_BURST_SHADOW_1,
			Patterns.RUMIA_BURST_SHADOW_2,
			Patterns.RUMIA_BURST_SHADOW_3,
			Patterns.RUMIA_BURST_SHADOW_4,
			Patterns.RUMIA_BURST_SHADOW_5,
			Patterns.RUMIA_BURST_SHADOW_6,
		],
	},
];

const DRIFT_OFFSET = 50;
const DRIFT_OFFSET_P2 = 70;
const DRIFT_OFFSET_P3 = 55;
const DRIFT_OFFSET_P4 = 65;
const DRIFT_LERP = 2.5;

export class Rumia extends Boss {
	private entered: boolean = false;
	private charging: boolean = false;
	private chargeSheet!: Spritesheet;

	private ftmMoving: boolean = false;
	private ftmMoveDir: number = 1;
	private ftmMoveTarget: number = BOSS.CENTER_X;

	private p2FireTimer: number = 0;
	private static readonly P2_MOVE_INTERVAL = 9.0;
	private p3FireTimer: number = 0;
	private static readonly P3_MOVE_INTERVAL = 7.0;

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

		this.chargeSheet = new Spritesheet({
			src: 'assets/sprites/effects/bosscharge.png',
			frameX: 64,
			frameY: 64,
			frameCount: 9,
			frameSpeed: 0.07,
			looping: false,
		});

		this.scoreValue = 80000;
		this.music = Music.BOSS;
	}

	updateMovement(dt: number): void {
		if (!this.entered) {
			this.y += BOSS_ENTRY.ENTRY_SPEED * dt;
			this.isMoving = false;
			if (this.y >= BOSS.CENTER_Y) {
				this.y = BOSS.CENTER_Y;
				this.entered = true;
				this.charging = true;
				SoundManager.play(SFX.BOSS_CHARGE);
			}
			return;
		}

		if (this.charging) {
			this.chargeSheet.update(dt);
			if (this.chargeSheet.isFinished()) {
				this.charging = false;
				this.completeEntry();
			}
			return;
		}

		const driftOffset =
			this.currentPhaseIndex === 1
				? DRIFT_OFFSET_P2
				: this.currentPhaseIndex === 2
					? DRIFT_OFFSET_P3
					: this.currentPhaseIndex === 3
						? DRIFT_OFFSET_P4
						: DRIFT_OFFSET;

		if (this.ftmMoving) {
			const dx = this.ftmMoveTarget - this.x;
			const dy = BOSS.CENTER_Y - this.y;
			this.x += dx * DRIFT_LERP * dt;
			this.y += dy * BOSS_ENTRY.FTM_Y_LERP * dt;
			this.isMoving = Math.abs(dx) > 2;

			if (Math.abs(dx) < 3 && Math.abs(dy) < 3) {
				this.x = this.ftmMoveTarget;
				this.y = BOSS.CENTER_Y;
				this.isMoving = false;
				this.ftmMoving = false;
			}
		} else {
			const dx = BOSS.CENTER_X - this.x;
			const dy = BOSS.CENTER_Y - this.y;
			this.x += dx * BOSS_ENTRY.RETURN_LERP * dt;
			this.y += dy * BOSS_ENTRY.RETURN_LERP * dt;
			this.isMoving = false;

			const isSpellCard =
				this.phases[this.currentPhaseIndex]?.isSpellCard ?? false;
			const isP3 = this.currentPhaseIndex === 2;
			const readyToMove = isSpellCard
				? (this.p2FireTimer += dt) >= Rumia.P2_MOVE_INTERVAL
				: isP3
					? (this.p3FireTimer += dt) >= Rumia.P3_MOVE_INTERVAL
					: this.allPatternsDone();

			if (this.state === BossState.ACTIVE && readyToMove) {
				this.ftmMoving = true;
				this.ftmMoveDir = -this.ftmMoveDir;
				this.ftmMoveTarget = BOSS.CENTER_X + this.ftmMoveDir * driftOffset;
				this.p2FireTimer = 0;
				this.p3FireTimer = 0;
				this.resetPatternEngines();
			}
		}
	}

	override render(ctx: CanvasRenderingContext2D): void {
		super.render(ctx);
		if (this.charging) {
			this.chargeSheet.draw(ctx, this.x - 32, this.y - 32, 64, 64);
		}
	}
}
