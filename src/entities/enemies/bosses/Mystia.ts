import { Boss, BossPhase, BossState } from '../../Boss';
import { Spritesheet, createExplosionSheet } from '../../../utils/Spritesheet';
import { Patterns } from '../../../patterns/PatternLibrary';
import { BOSS } from '../../../game/Constants';

const PHASES: BossPhase[] = [
	{
		name: '',
		isSpellCard: false,
		hp: 260,
		timer: 35,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'life', count: 1 },
		],
		patterns: [
			Patterns.S3_MYSTIA_BOSS_RAIN_BALL_GREEN_E,
			Patterns.S3_MYSTIA_BOSS_RAIN_BALL_GREEN_N,
			Patterns.S3_MYSTIA_BOSS_RAIN_BALL_GREEN_H,
			Patterns.S3_MYSTIA_BOSS_RAIN_BALL_GREEN_L,
			Patterns.S3_MYSTIA_BOSS_RAIN_ORB_PURPLE_E,
			Patterns.S3_MYSTIA_BOSS_RAIN_ORB_PURPLE_N,
			Patterns.S3_MYSTIA_BOSS_RAIN_ORB_PURPLE_H,
			Patterns.S3_MYSTIA_BOSS_RAIN_ORB_PURPLE_L,
			Patterns.S3_MYSTIA_BOSS_FEATHER_CIRCLE_E,
			Patterns.S3_MYSTIA_BOSS_FEATHER_CIRCLE_N,
			Patterns.S3_MYSTIA_BOSS_FEATHER_CIRCLE_H,
			Patterns.S3_MYSTIA_BOSS_FEATHER_CIRCLE_L,
		],
	},
	{
		name: 'Vocal Sign 「Hooting in the Night」',
		isSpellCard: true,
		hp: 320,
		timer: 40,
		drops: [
			{ type: 'bigpoint', count: 4 },
			{ type: 'power', count: 8 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [
			Patterns.S3_MYSTIA_BOSS_SPIRAL_MED_CW_E,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_SMALL_CW_E,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_MED_CCW_E,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_SMALL_CCW_E,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_MED_CW_N,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_SMALL_CW_N,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_MED_CCW_N,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_SMALL_CCW_N,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_MED_CW_H,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_SMALL_CW_H,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_MED_CCW_H,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_SMALL_CCW_H,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_MED_CW_L,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_SMALL_CW_L,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_MED_CCW_L,
			Patterns.S3_MYSTIA_BOSS_SPIRAL_SMALL_CCW_L,
		],
	},
	{
		name: '',
		isSpellCard: false,
		hp: 280,
		timer: 35,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'life', count: 1 },
		],
		patterns: [
			Patterns.S3_MYSTIA_BOSS_P3_FEATHER_E,
			Patterns.S3_MYSTIA_BOSS_P3_FEATHER_N,
			Patterns.S3_MYSTIA_BOSS_P3_FEATHER_H,
			Patterns.S3_MYSTIA_BOSS_P3_FEATHER_L,
		],
	},
	{
		name: 'Song Sign 「Mystia Lullaby」',
		isSpellCard: true,
		hp: 400,
		timer: 45,
		drops: [
			{ type: 'bigpoint', count: 5 },
			{ type: 'power', count: 10 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [
			Patterns.S3_MYSTIA_BOSS_P4_NOTE_E,
			Patterns.S3_MYSTIA_BOSS_P4_NOTE_N,
			Patterns.S3_MYSTIA_BOSS_P4_NOTE_H,
			Patterns.S3_MYSTIA_BOSS_P4_NOTE_L,
			Patterns.S3_MYSTIA_BOSS_P4_LASER_E,
			Patterns.S3_MYSTIA_BOSS_P4_LASER_N,
			Patterns.S3_MYSTIA_BOSS_P4_LASER_H,
			Patterns.S3_MYSTIA_BOSS_P4_LASER_L,
			Patterns.S3_MYSTIA_BOSS_P4_ORB_SIDE_LEFT,
			Patterns.S3_MYSTIA_BOSS_P4_ORB_SIDE_RIGHT,
			Patterns.S3_MYSTIA_BOSS_P4_PURPLEFLOWER,
		],
	},
];

const P3_FEATHER_PATTERNS = [
	'S3_MYSTIA_BOSS_P3_FEATHER_E',
	'S3_MYSTIA_BOSS_P3_FEATHER_N',
	'S3_MYSTIA_BOSS_P3_FEATHER_H',
	'S3_MYSTIA_BOSS_P3_FEATHER_L',
];
const P3_VOLLEY_PATTERNS = [
	'S3_MYSTIA_BOSS_P3_ORB_VOLLEY_E',
	'S3_MYSTIA_BOSS_P3_ORB_VOLLEY_N',
	'S3_MYSTIA_BOSS_P3_ORB_VOLLEY_H',
	'S3_MYSTIA_BOSS_P3_ORB_VOLLEY_L',
];

const DRIFT_OFFSET_DEFAULT = 50;
const P1_SIDE_OFFSET = 85;
const P1_WAIT_ON_SIDE = 3.5;
const P1_MOVE_LERP = 3.0;

const DRIFT_OFFSET_P2 = 60;
const MOVE_INTERVAL_P2 = 3.0;

const P3_SWEEP_OFFSET = 90;
const P3_SWEEP_LERP = 7.0;
const P3_RETURN_LERP = 5.0;
const P3_SWEEP_COUNT = 4;
const P3_VOLLEY_DURATION = 3.0;

type P3State = 'sweep' | 'returning' | 'volley';

export class MystiaBoss extends Boss {
	private p1MoveDir: number = -1;
	private p1OnSide: boolean = false;
	private p1WaitTimer: number = 0;
	private p2MoveTimer: number = 0;

	private p3State: P3State = 'sweep';
	private p3SweepDir: number = -1;
	private p3SweepsRemaining: number = P3_SWEEP_COUNT;
	private p3VolleyTimer: number = 0;
	private p3LastPhaseIndex: number = -1;

	constructor(x: number, y: number) {
		const idleSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/mystia/mystia_spritesheet.png',
			frameX: 36,
			frameY: 36,
			frameCount: 4,
			frameSpeed: 0.12,
			looping: true,
		});
		const movingSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/mystia/mystia_spritesheet.png',
			frameX: 36,
			frameY: 36,
			frameCount: 4,
			frameSpeed: 0.12,
			looping: true,
		});
		const explSheet = createExplosionSheet();

		super(x, y, 36, 36, idleSheet, movingSheet, explSheet, PHASES);

		this.scoreValue = 75000;
		this.dialogueId = 'mystia';
		this.spellcardBgSrc =
			'assets/sprites/backgrounds/stage3_mystia_spellcard.png';
	}

	updateMovement(dt: number): void {
		if (this.handleEntryAndCharge(dt)) return;

		if (this.currentPhaseIndex === 3) {
			this.handleFtmMovement(dt, 0, false);
			return;
		}

		if (this.currentPhaseIndex === 2) {
			if (this.p3LastPhaseIndex !== 2) {
				this.p3LastPhaseIndex = 2;
				this.p3EnterSweep();
			}
			if (this.state === BossState.ACTIVE) this.updateP3(dt);
			return;
		}

		if (this.currentPhaseIndex === 1) {
			if (!this.ftmMoving && this.state === BossState.ACTIVE)
				this.p2MoveTimer += dt;
			const shouldMove = this.p2MoveTimer >= MOVE_INTERVAL_P2;

			this.handleFtmMovement(dt, DRIFT_OFFSET_P2, shouldMove, () => {
				this.p2MoveTimer = 0;
				this.resetPatternEngines();
			});
			return;
		}

		if (this.currentPhaseIndex === 0 && this.state === BossState.ACTIVE) {
			if (!this.p1OnSide) {
				const targetX = BOSS.CENTER_X + this.p1MoveDir * P1_SIDE_OFFSET;
				const dx = targetX - this.x;
				const dy = BOSS.CENTER_Y - this.y;
				this.x += dx * P1_MOVE_LERP * dt;
				this.y += dy * P1_MOVE_LERP * dt;
				this.isMoving = Math.abs(dx) > 3;
				if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
					this.x = targetX;
					this.y = BOSS.CENTER_Y;
					this.isMoving = false;
					this.p1OnSide = true;
					this.p1WaitTimer = 0;
					this.resetPatternEngines();
				}
			} else {
				this.p1WaitTimer += dt;
				if (this.p1WaitTimer >= P1_WAIT_ON_SIDE) {
					this.p1OnSide = false;
					this.p1MoveDir = -this.p1MoveDir;
				}
			}
			return;
		}

		this.handleFtmMovement(dt, DRIFT_OFFSET_DEFAULT, false);
	}

	private updateP3(dt: number): void {
		switch (this.p3State) {
			case 'sweep': {
				const targetX = BOSS.CENTER_X + this.p3SweepDir * P3_SWEEP_OFFSET;
				const dx = targetX - this.x;
				const dy = BOSS.CENTER_Y - this.y;
				this.x += dx * P3_SWEEP_LERP * dt;
				this.y += dy * P3_SWEEP_LERP * dt;
				this.isMoving = Math.abs(dx) > 3;
				if (Math.abs(dx) < 2) {
					this.x = targetX;
					this.y = BOSS.CENTER_Y;
					this.p3SweepDir = -this.p3SweepDir;
					this.p3SweepsRemaining--;
					if (this.p3SweepsRemaining <= 0) {
						this.p3State = 'returning';
					}
				}
				break;
			}
			case 'returning': {
				const dx = BOSS.CENTER_X - this.x;
				const dy = BOSS.CENTER_Y - this.y;
				this.x += dx * P3_RETURN_LERP * dt;
				this.y += dy * P3_RETURN_LERP * dt;
				this.isMoving = Math.abs(dx) > 3;
				if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
					this.x = BOSS.CENTER_X;
					this.y = BOSS.CENTER_Y;
					this.isMoving = false;
					this.p3EnterVolley();
				}
				break;
			}
			case 'volley': {
				this.p3VolleyTimer += dt;
				if (this.p3VolleyTimer >= P3_VOLLEY_DURATION) {
					this.p3EnterSweep();
				}
				break;
			}
		}
	}

	private p3EnterSweep(): void {
		this.p3State = 'sweep';
		this.p3SweepsRemaining = P3_SWEEP_COUNT;
		this.setPatterns(P3_FEATHER_PATTERNS.map(name => Patterns[name]));
	}

	private p3EnterVolley(): void {
		this.p3State = 'volley';
		this.p3VolleyTimer = 0;
		this.setPatterns(P3_VOLLEY_PATTERNS.map(name => Patterns[name]));
	}
}
