import { Boss, BossPhase, BossState } from '../../Boss';
import { Spritesheet, createExplosionSheet } from '../../../utils/Spritesheet';
import { SoundManager, SFX } from '../../../systems/SoundManager';
import { Patterns } from '../../../game/patterns/PatternLibrary';
import { BOSS, BOSS_ENTRY } from '../../../game/Constants';

const PHASES: BossPhase[] = [
	{
		name: '',
		isSpellCard: false,
		hp: 200,
		timer: 35,
		barWeight: 0.7,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'life', count: 1 },
		],
		patterns: [
			Patterns.RUMIA_PINWHEEL_1,
			Patterns.RUMIA_PINWHEEL_2,
			Patterns.RUMIA_PINWHEEL_SUPER,
			Patterns.RUMIA_PINWHEEL_SUPER_2,
			Patterns.RUMIA_ORB_RINGS_1,
			Patterns.RUMIA_ORB_RINGS_2,
		],
	},
	{
		name: 'Dark Sign 「Night Fog Miasma」',
		isSpellCard: true,
		hp: 200,
		timer: 30,
		barWeight: 0.3,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [
			Patterns.RUMIA_ROSE_1,
			Patterns.RUMIA_ROSE_2,
			Patterns.RUMIA_ROSE_3,
			Patterns.RUMIA_SHADOW_CIRCLE_1,
			Patterns.RUMIA_SHADOW_CIRCLE_2,
			Patterns.RUMIA_VOLLEY_1,
			Patterns.RUMIA_VOLLEY_2,
		],
	},
];

const DRIFT_OFFSET_P1 = 45;
const DRIFT_OFFSET_P2 = 75;
const DRIFT_LERP = 2.5;

export class RumiaDark extends Boss {
	private entered: boolean = false;
	private charging: boolean = false;
	private chargeSheet!: Spritesheet;

	private ftmMoving: boolean = false;
	private ftmMoveDir: number = 1;
	private ftmMoveTarget: number = BOSS.CENTER_X;
	private p2FireTimer: number = 0;
	private static readonly P2_MOVE_INTERVAL = 6.0;

	constructor(x: number, y: number) {
		const idleSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/rumia/rumiadark.png',
			frameX: 32,
			frameY: 32,
			frameCount: 1,
			frameSpeed: 1,
			looping: true,
		});
		const movingSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/rumia/rumiadarkmoving.png',
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

		this.scoreValue = 50000;
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
			this.currentPhaseIndex === 0 ? DRIFT_OFFSET_P1 : DRIFT_OFFSET_P2;
		this.updateFireThenMove(dt, driftOffset);
	}

	private updateFireThenMove(dt: number, driftOffset: number): void {
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
				this.resetPatternEngines();
				this.p2FireTimer = 0;
			}
		} else {
			const dx = BOSS.CENTER_X - this.x;
			const dy = BOSS.CENTER_Y - this.y;
			this.x += dx * BOSS_ENTRY.RETURN_LERP * dt;
			this.y += dy * BOSS_ENTRY.RETURN_LERP * dt;
			this.isMoving = false;

			const shouldMove =
				this.currentPhaseIndex === 1
					? (this.p2FireTimer += dt) >= RumiaDark.P2_MOVE_INTERVAL
					: this.allPatternsDone();

			if (this.state === BossState.ACTIVE && shouldMove) {
				this.ftmMoving = true;
				this.ftmMoveDir = -this.ftmMoveDir;
				this.ftmMoveTarget = BOSS.CENTER_X + this.ftmMoveDir * driftOffset;
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
