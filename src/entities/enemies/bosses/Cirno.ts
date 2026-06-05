import { Boss, BossPhase, BossState } from '../../Boss';
import { Spritesheet, createExplosionSheet } from '../../../utils/Spritesheet';
import { Patterns } from '../../../patterns/PatternLibrary';
import { Music } from '../../../systems/MusicManager';
import { BOSS } from '../../../game/Constants';

const PHASES: BossPhase[] = [
	{
		name: '',
		isSpellCard: false,
		hp: 325,
		timer: 30,
		barWeight: 0.15,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'life', count: 1 },
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
		timer: 40,
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
		timer: 35,
		barWeight: 0.16,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 5 },
			{ type: 'life', count: 1 },
		],
		patterns: [
			Patterns.CIRNO_GRAVITY_ICECUBES_E,
			Patterns.CIRNO_BLUE_CIRCLE_E,
			Patterns.CIRNO_GRAVITY_ICECUBES_N,
			Patterns.CIRNO_BLUE_CIRCLE_N,
			Patterns.CIRNO_GRAVITY_ICECUBES_H,
			Patterns.CIRNO_BLUE_CIRCLE_H,
			Patterns.CIRNO_GRAVITY_ICECUBES_L,
			Patterns.CIRNO_BLUE_CIRCLE_L,
			Patterns.CIRNO_SPECIAL_SPREAD_N,
			Patterns.CIRNO_SPECIAL_SPREAD_H,
			Patterns.CIRNO_SPECIAL_SPREAD_L,
		],
	},
	{
		name: 'Freeze Sign 「Perfect Freeze」',
		isSpellCard: true,
		hp: 325,
		timer: 40,
		barWeight: 0.18,
		drops: [
			{ type: 'bigpoint', count: 4 },
			{ type: 'power', count: 8 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [
			Patterns.CIRNO_SNOWFLAKE,
			Patterns.CIRNO_SNOWFLAKE_L,
			Patterns.CIRNO_PERFECT_FREEZE_BLUE,
			Patterns.CIRNO_PERFECT_FREEZE_GREEN,
			Patterns.CIRNO_PERFECT_FREEZE_RED,
			Patterns.CIRNO_PERFECT_FREEZE_PURPLE,
			Patterns.CIRNO_PERFECT_FREEZE_YELLOW,
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
			{ type: 'life', count: 1 },
		],
		patterns: [
			Patterns.CIRNO_ARROWHEAD_CIRCLE_BLUE_EN,
			Patterns.CIRNO_ARROWHEAD_CIRCLE_CYAN_EN,
			Patterns.CIRNO_ARROWHEAD_CIRCLE_BLUE_HL,
			Patterns.CIRNO_ARROWHEAD_CIRCLE_CYAN_HL,
			Patterns.CIRNO_ORB_EXPLOSION_BLUE_E,
			Patterns.CIRNO_ORB_EXPLOSION_CYAN_E,
			Patterns.CIRNO_ORB_EXPLOSION_BLUE_N,
			Patterns.CIRNO_ORB_EXPLOSION_CYAN_N,
			Patterns.CIRNO_ORB_EXPLOSION_BLUE_H,
			Patterns.CIRNO_ORB_EXPLOSION_CYAN_H,
			Patterns.CIRNO_ORB_EXPLOSION_BLUE_L,
			Patterns.CIRNO_ORB_EXPLOSION_CYAN_L,
		],
	},
	{
		name: 'Cold Sign 「Frozen Eternity」',
		isSpellCard: true,
		hp: 425,
		timer: 45,
		barWeight: 0.17,
		drops: [
			{ type: 'bigpoint', count: 6 },
			{ type: 'power', count: 12 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [
			Patterns.CIRNO_LASER_CIRCLE_E,
			Patterns.CIRNO_LASER_CIRCLE_N,
			Patterns.CIRNO_LASER_CIRCLE_H,
			Patterns.CIRNO_LASER_CIRCLE_L,
			Patterns.CIRNO_RAIN_ORB,
			Patterns.CIRNO_RICE_RAIN_E,
			Patterns.CIRNO_RICE_RAIN_N,
			Patterns.CIRNO_RICE_RAIN_H,
			Patterns.CIRNO_RICE_RAIN_L,
		],
	},
];

const DRIFT_OFFSET_NORMAL = 30;
const DRIFT_OFFSET_SPELL = 40;
const MOVE_INTERVAL = 7.0;
const MOVE_INTERVAL_P3 = 2.2;
const PHASE6_Y = 20;
const STATIC_PHASES = new Set([3, 4]);

export class Cirno extends Boss {
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

		this.scoreValue = 150000;
		this.dialogueId = 'cirno';
		this.music = Music.BOSS2;
		this.spellcardBgSrc =
			'assets/sprites/backgrounds/stage2_cirno_spellcard.png';
	}

	updateMovement(dt: number): void {
		if (this.handleEntryAndCharge(dt)) return;

		if (this.currentPhaseIndex === 5) {
			const dx = BOSS.CENTER_X - this.x;
			const dy = PHASE6_Y - this.y;
			this.x += dx * 2.0 * dt;
			this.y += dy * 2.0 * dt;
			this.isMoving = false;
			return;
		}

		const driftOffset =
			this.currentPhaseIndex % 2 === 1
				? DRIFT_OFFSET_SPELL
				: DRIFT_OFFSET_NORMAL;

		if (!this.ftmMoving && this.state === BossState.ACTIVE)
			this.moveTimer += dt;
		const moveInterval =
			this.currentPhaseIndex === 2 ? MOVE_INTERVAL_P3 : MOVE_INTERVAL;
		const shouldMove =
			!STATIC_PHASES.has(this.currentPhaseIndex) &&
			this.moveTimer >= moveInterval;

		this.handleFtmMovement(dt, driftOffset, shouldMove, () => {
			this.moveTimer = 0;
			this.resetPatternEngines();
		});
	}
}
