import { Boss, BossPhase, BossState } from '../../Boss';
import { Spritesheet, createExplosionSheet } from '../../../utils/Spritesheet';
import { SoundManager, SFX } from '../../../systems/SoundManager';
import { Patterns } from '../../../game/patterns/PatternLibrary';
import { Music } from '../../../systems/MusicManager';
import { BOSS, BOSS_ENTRY } from '../../../game/Constants';

const PHASES: BossPhase[] = [
	{
		name: '',
		isSpellCard: false,
		hp: 325,
		timer: 40,
		barWeight: 0.15,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 4 },
		],
		patterns: [
			Patterns.CIRNO_ICE_HELIX_E,
			Patterns.CIRNO_ICE_HELIX_CW_E,
			Patterns.CIRNO_ICE_HELIX_N,
			Patterns.CIRNO_ICE_HELIX_CW_N,
			Patterns.CIRNO_ICE_HELIX_H,
			Patterns.CIRNO_ICE_HELIX_CW_H,
			Patterns.CIRNO_ICE_HELIX_L,
			Patterns.CIRNO_ICE_HELIX_CW_L,
		],
	},
	{
		name: 'Ice Sign 「No miss!icicle homing missile」',
		isSpellCard: true,
		hp: 325,
		timer: 45,
		barWeight: 0.18,
		drops: [
			{ type: 'bigpoint', count: 3 },
			{ type: 'power', count: 6 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [
			Patterns.CIRNO_AIMED_ICECUBES_E,
			Patterns.CIRNO_CIRCLE_CRISTALS_E,
			Patterns.CIRNO_AIMED_ICECUBES_N,
			Patterns.CIRNO_CIRCLE_CRISTALS_N,
			Patterns.CIRNO_AIMED_ICECUBES_H,
			Patterns.CIRNO_CIRCLE_CRISTALS_H,
			Patterns.CIRNO_AIMED_ICECUBES_L,
			Patterns.CIRNO_CIRCLE_CRISTALS_L,
			Patterns.CIRNO_SIMPLE_CIRCLE_EN,
			Patterns.CIRNO_SIMPLE_CIRCLE_HL,
		],
	},
	{
		name: '',
		isSpellCard: false,
		hp: 325,
		timer: 40,
		barWeight: 0.16,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 5 },
		],
		patterns: [Patterns.BLANK],
	},
	{
		name: 'Freeze Sign 「Perfect Freeze」',
		isSpellCard: true,
		hp: 325,
		timer: 50,
		barWeight: 0.18,
		drops: [
			{ type: 'bigpoint', count: 4 },
			{ type: 'power', count: 8 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [Patterns.BLANK],
	},
	{
		name: '',
		isSpellCard: false,
		hp: 325,
		timer: 40,
		barWeight: 0.16,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 5 },
			{ type: 'life', count: 1 },
		],
		patterns: [Patterns.BLANK],
	},
	{
		name: 'Cold Sign 「Frozen Eternity」',
		isSpellCard: true,
		hp: 325,
		timer: 60,
		barWeight: 0.17,
		drops: [
			{ type: 'bigpoint', count: 6 },
			{ type: 'power', count: 12 },
			{ type: 'bomb', count: 2 },
		],
		patterns: [Patterns.BLANK],
	},
];

const DRIFT_OFFSET_NORMAL = 90;
const DRIFT_OFFSET_SPELL = 40;
const DRIFT_LERP = 2.5;
const MOVE_INTERVAL = 7.0;

export class Cirno extends Boss {
	private entered: boolean = false;
	private charging: boolean = false;
	private chargeSheet!: Spritesheet;

	private ftmMoving: boolean = false;
	private ftmMoveDir: number = 1;
	private ftmMoveTarget: number = BOSS.CENTER_X;
	private moveTimer: number = 0;

	constructor(x: number, y: number) {
		const idleSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/cirno/cirno_spritesheet.png',
			frameX: 32,
			frameY: 32,
			frameCount: 5,
			frameSpeed: 0.12,
			looping: true,
		});
		const movingSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/cirno/cirno_spritesheet.png',
			frameX: 32,
			frameY: 32,
			frameCount: 5,
			frameSpeed: 0.12,
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

		this.scoreValue = 150000;
		this.music = Music.BOSS2;
		this.spellcardBgSrc =
			'assets/sprites/backgrounds/stage2_cirno_spellcard.png';
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

			if (this.state === BossState.ACTIVE) {
				this.moveTimer += dt;
				if (this.moveTimer >= MOVE_INTERVAL) {
					this.ftmMoving = true;
					this.ftmMoveDir = -this.ftmMoveDir;
					const driftOffset =
						this.currentPhaseIndex % 2 === 1
							? DRIFT_OFFSET_SPELL
							: DRIFT_OFFSET_NORMAL;
					this.ftmMoveTarget = BOSS.CENTER_X + this.ftmMoveDir * driftOffset;
					this.moveTimer = 0;
					this.resetPatternEngines();
				}
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
