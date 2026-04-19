import { Boss, BossPhase, BossState } from '../../Boss';
import { Spritesheet, createExplosionSheet } from '../../../utils/Spritesheet';
import { Patterns } from '../../../game/patterns/PatternLibrary';
import { Music } from '../../../systems/MusicManager';

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
const MOVE_INTERVAL = 7.0;

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
		this.music = Music.BOSS2;
		this.spellcardBgSrc =
			'assets/sprites/backgrounds/stage2_cirno_spellcard.png';
	}

	updateMovement(dt: number): void {
		if (this.handleEntryAndCharge(dt)) return;

		const driftOffset =
			this.currentPhaseIndex % 2 === 1
				? DRIFT_OFFSET_SPELL
				: DRIFT_OFFSET_NORMAL;

		if (!this.ftmMoving && this.state === BossState.ACTIVE)
			this.moveTimer += dt;
		const shouldMove = this.moveTimer >= MOVE_INTERVAL;

		this.handleFtmMovement(dt, driftOffset, shouldMove, () => {
			this.moveTimer = 0;
			this.resetPatternEngines();
		});
	}
}
