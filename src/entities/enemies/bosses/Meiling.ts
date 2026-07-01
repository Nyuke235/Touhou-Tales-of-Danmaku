import { Boss, BossPhase, BossState } from '../../Boss';
import { Spritesheet, createExplosionSheet } from '../../../utils/Spritesheet';
import { Patterns } from '../../../patterns/PatternLibrary';
import { PatternConfig } from '../../../patterns/PatternEngine';
import { GameState, Difficulty } from '../../../game/GameState';
import { Music } from '../../../systems/MusicManager';
import { PlayerPosition } from '../../../game/PlayerPosition';
import { FIELD } from '../../../game/Constants';

const P2_COLORS = [
	'RED',
	'PURPLE',
	'BLUE',
	'CYAN',
	'GREEN',
	'YELLOW',
	'ORANGE',
];
const P2_FWD_PATTERNS = P2_COLORS.map(c => `S3_MEILING_BOSS_P2_FWD_${c}`);
const P2_REV_PATTERNS = P2_COLORS.map(c => `S3_MEILING_BOSS_P2_REV_${c}`);
const P2_FLAT_PATTERNS = P2_COLORS.map(c => `S3_MEILING_BOSS_P2_FLAT_${c}`);

const P2_STATE_DURATION: Record<Difficulty, number> = {
	EASY: 1.8,
	NORMAL: 1.4,
	HARD: 1.1,
	LUNATIC: 0.8,
};

const PHASES: BossPhase[] = [
	{
		name: '',
		isSpellCard: false,
		hp: 300,
		timer: 40,
		barWeight: 1.0,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'life', count: 1 },
		],
		patterns: [],
	},
	{
		name: 'Gate Sign 「Vibrant Flower」',
		isSpellCard: true,
		hp: 380,
		timer: 50,
		barWeight: 1.0,
		drops: [
			{ type: 'bigpoint', count: 5 },
			{ type: 'power', count: 8 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [],
	},
	{
		name: '',
		isSpellCard: false,
		hp: 280,
		timer: 38,
		barWeight: 1.0,
		drops: [
			{ type: 'bigpoint', count: 3 },
			{ type: 'power', count: 6 },
			{ type: 'life', count: 1 },
		],
		patterns: [],
	},
	{
		name: 'Color Sign 「Seven-Colored Qi Wall」',
		isSpellCard: true,
		hp: 420,
		timer: 55,
		barWeight: 1.0,
		drops: [
			{ type: 'bigpoint', count: 6 },
			{ type: 'power', count: 8 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [],
	},
	{
		name: '',
		isSpellCard: false,
		hp: 200,
		timer: 25,
		barWeight: 1.0,
		drops: [
			{ type: 'bigpoint', count: 3 },
			{ type: 'power', count: 6 },
			{ type: 'life', count: 1 },
		],
		patterns: [],
	},
	{
		name: 'Color Sign 「Aromatic Flowing Clouds」',
		isSpellCard: true,
		hp: 450,
		timer: 60,
		barWeight: 1.0,
		drops: [
			{ type: 'bigpoint', count: 6 },
			{ type: 'power', count: 8 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [],
	},
];

const SWIRL_FWD_PATTERNS = [
	'S3_MEILING_BOSS_SWIRL_FWD_RED_PRE',
	'S3_MEILING_BOSS_SWIRL_FWD_RED',
	'S3_MEILING_BOSS_SWIRL_FWD_PURPLE',
	'S3_MEILING_BOSS_SWIRL_FWD_BLUE',
	'S3_MEILING_BOSS_SWIRL_FWD_CYAN',
	'S3_MEILING_BOSS_SWIRL_FWD_GREEN',
	'S3_MEILING_BOSS_SWIRL_FWD_YELLOW',
	'S3_MEILING_BOSS_SWIRL_FWD_ORANGE',
	'S3_MEILING_BOSS_SWIRL_FWD_ORANGE_POST',
];
const SWIRL_REV_PATTERNS = [
	'S3_MEILING_BOSS_SWIRL_REV_RED_PRE',
	'S3_MEILING_BOSS_SWIRL_REV_RED',
	'S3_MEILING_BOSS_SWIRL_REV_PURPLE',
	'S3_MEILING_BOSS_SWIRL_REV_BLUE',
	'S3_MEILING_BOSS_SWIRL_REV_CYAN',
	'S3_MEILING_BOSS_SWIRL_REV_GREEN',
	'S3_MEILING_BOSS_SWIRL_REV_YELLOW',
	'S3_MEILING_BOSS_SWIRL_REV_ORANGE',
	'S3_MEILING_BOSS_SWIRL_REV_ORANGE_POST',
];
const VARIANCE_PATTERNS: Record<Difficulty, string[]> = {
	EASY: ['S3_MEILING_BOSS_VAR_RED_E', 'S3_MEILING_BOSS_VAR_BLUE_E'],
	NORMAL: [
		'S3_MEILING_BOSS_VAR_RED_N',
		'S3_MEILING_BOSS_VAR_BLUE_N',
		'S3_MEILING_BOSS_VAR_YELLOW_N',
	],
	HARD: [
		'S3_MEILING_BOSS_VAR_RED_H',
		'S3_MEILING_BOSS_VAR_BLUE_H',
		'S3_MEILING_BOSS_VAR_GREEN_H',
		'S3_MEILING_BOSS_VAR_PURPLE_H',
	],
	LUNATIC: [
		'S3_MEILING_BOSS_VAR_RED_L',
		'S3_MEILING_BOSS_VAR_BLUE_L',
		'S3_MEILING_BOSS_VAR_GREEN_L',
		'S3_MEILING_BOSS_VAR_PURPLE_L',
		'S3_MEILING_BOSS_VAR_YELLOW_L',
	],
};

const SWIRL_FWD_DURATION = 1.8;
const SWIRL_REV_DURATION = 1.8;
const VARIANCE_DURATION = 1.6;

const DRIFT_OFFSET = 60;
const MOVE_INTERVAL = 3.2;

const P3_PATTERNS = [
	'S3_MEILING_BOSS_P3_RING_RED',
	'S3_MEILING_BOSS_P3_RING_PURPLE',
	'S3_MEILING_BOSS_P3_RING_BLUE',
	'S3_MEILING_BOSS_P3_RING_CYAN',
	'S3_MEILING_BOSS_P3_RING_GREEN',
	'S3_MEILING_BOSS_P3_RING_YELLOW',
	'S3_MEILING_BOSS_P3_RING_ORANGE',
	'S3_MEILING_BOSS_P3_NOISE_RED_N',
	'S3_MEILING_BOSS_P3_NOISE_RED_H',
	'S3_MEILING_BOSS_P3_NOISE_RED_L',
	'S3_MEILING_BOSS_P3_NOISE_BLUE_N',
	'S3_MEILING_BOSS_P3_NOISE_BLUE_H',
	'S3_MEILING_BOSS_P3_NOISE_BLUE_L',
	'S3_MEILING_BOSS_P3_NOISE_GREEN_N',
	'S3_MEILING_BOSS_P3_NOISE_GREEN_H',
	'S3_MEILING_BOSS_P3_NOISE_GREEN_L',
	'S3_MEILING_BOSS_P3_NOISE_YELLOW_N',
	'S3_MEILING_BOSS_P3_NOISE_YELLOW_H',
	'S3_MEILING_BOSS_P3_NOISE_YELLOW_L',
];

const P3_MOVE_SPEED = 200;
const P3_PAUSE_DURATION = 1.0;
const P3_TARGET_Y_MIN = 24;
const P3_TARGET_Y_MAX = FIELD.HEIGHT - 28;
const P3_TARGET_X_MARGIN = 24;

const P4_PATTERNS = [
	'S3_MEILING_BOSS_P4_QI_WALL_EN',
	'S3_MEILING_BOSS_P4_QI_WALL_H',
	'S3_MEILING_BOSS_P4_QI_WALL_L',
	'S3_MEILING_BOSS_P4_BALL_N',
	'S3_MEILING_BOSS_P4_BALL_H',
	'S3_MEILING_BOSS_P4_BALL_L',
];
const P4_TARGET_X = FIELD.WIDTH / 2;
const P4_TARGET_Y = 40;
const P4_MOVE_SPEED = 160;

const P5_PATTERNS = [
	'S3_MEILING_BOSS_P5_RING_RED',
	'S3_MEILING_BOSS_P5_RING_PURPLE',
	'S3_MEILING_BOSS_P5_RING_BLUE',
	'S3_MEILING_BOSS_P5_RING_CYAN',
	'S3_MEILING_BOSS_P5_RING_GREEN',
	'S3_MEILING_BOSS_P5_RING_YELLOW',
	'S3_MEILING_BOSS_P5_RING_ORANGE',
];

const P6_PATTERN_NAME = 'S3_MEILING_BOSS_P6_FOUNTAIN';
const P6_TARGET_Y = 50;
const P6_MOVE_SPEED = 130;
const P6_POSITIONS_X = [
	FIELD.WIDTH / 2, // center
	FIELD.WIDTH * 0.33, // left
	FIELD.WIDTH / 2, // center
	FIELD.WIDTH * 0.67, // right
];

type P1State = 'swirl_fwd' | 'swirl_rev' | 'variance';
type P2State = 'fwd' | 'rev' | 'flat';
type P3State = 'moving' | 'firing' | 'paused';

export class MeilingBoss extends Boss {
	private p1State: P1State = 'swirl_fwd';
	private p1StateTimer: number = 0;
	private p1Initialized: boolean = false;
	private p2State: P2State = 'fwd';
	private p2StateTimer: number = 0;
	private p2Initialized: boolean = false;
	private p3State: P3State = 'moving';
	private p3StateTimer: number = 0;
	private p3TargetX: number = 0;
	private p3TargetY: number = 0;
	private p3Initialized: boolean = false;
	private p4Initialized: boolean = false;
	private p4PatternsArmed: boolean = false;
	private p5Initialized: boolean = false;
	private p6Initialized: boolean = false;
	private p6PositionIndex: number = 0;
	private p6Firing: boolean = false;
	private moveTimer: number = 0;

	constructor(x: number, y: number) {
		const idleSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/meiling/meiling_spritesheet.png',
			frameX: 40,
			frameY: 40,
			frameCount: 4,
			frameSpeed: 0.12,
			looping: true,
		});
		const movingSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/meiling/meiling_spritesheet.png',
			frameX: 40,
			frameY: 40,
			frameCount: 4,
			frameSpeed: 0.12,
			looping: true,
		});
		const explSheet = createExplosionSheet();

		super(x, y, 40, 40, idleSheet, movingSheet, explSheet, PHASES);

		this.scoreValue = 90000;
		this.dialogueId = 'meiling';
		this.music = Music.BOSS3;
		this.spellcardBgSrc =
			'assets/sprites/backgrounds/stage3_meiling_spellcard.png';
	}

	updateMovement(dt: number): void {
		if (this.handleEntryAndCharge(dt)) return;

		if (this.currentPhaseIndex === 0 && this.state === BossState.ACTIVE) {
			if (!this.p1Initialized) {
				this.p1Initialized = true;
				this.enterState('swirl_fwd');
			}
			this.updateP1(dt);
		}

		if (this.currentPhaseIndex === 1 && this.state === BossState.ACTIVE) {
			if (!this.p2Initialized) {
				this.p2Initialized = true;
				this.enterP2State('fwd');
			}
			this.updateP2(dt);
		}

		if (this.currentPhaseIndex === 2 && this.state === BossState.ACTIVE) {
			if (!this.p3Initialized) {
				this.p3Initialized = true;
				this.recordP3Target();
				this.enterP3State('moving');
			}
			this.updateP3(dt);
			return;
		}

		if (this.currentPhaseIndex === 3 && this.state === BossState.ACTIVE) {
			if (!this.p4Initialized) {
				this.p4Initialized = true;
				this.p4PatternsArmed = false;
				this.setPatterns([]);
			}
			this.updateP4(dt);
			return;
		}

		if (this.currentPhaseIndex === 4 && this.state === BossState.ACTIVE) {
			if (!this.p5Initialized) {
				this.p5Initialized = true;
				this.setPatterns(P5_PATTERNS.map(n => Patterns[n]));
			}
		}

		if (this.currentPhaseIndex === 5 && this.state === BossState.ACTIVE) {
			if (!this.p6Initialized) {
				this.p6Initialized = true;
				this.p6PositionIndex = 0;
				this.p6Firing = false;
				this.setPatterns([]);
			}
			this.updateP6(dt);
			return;
		}

		if (!this.ftmMoving && this.state === BossState.ACTIVE) {
			this.moveTimer += dt;
		}
		const shouldMove = this.moveTimer >= MOVE_INTERVAL;
		this.handleFtmMovement(dt, DRIFT_OFFSET, shouldMove, () => {
			this.moveTimer = 0;
		});
	}

	private updateP1(dt: number): void {
		this.p1StateTimer += dt;
		const duration = this.stateDuration(this.p1State);
		if (this.p1StateTimer >= duration) {
			this.enterState(this.nextState(this.p1State));
		}
	}

	private nextState(s: P1State): P1State {
		if (s === 'swirl_fwd') {
			const diff = GameState.difficulty;
			if (diff === 'HARD' || diff === 'LUNATIC') return 'swirl_rev';
			return 'variance';
		}
		if (s === 'swirl_rev') return 'variance';
		return 'swirl_fwd';
	}

	private stateDuration(s: P1State): number {
		switch (s) {
			case 'swirl_fwd':
				return SWIRL_FWD_DURATION;
			case 'swirl_rev':
				return SWIRL_REV_DURATION;
			case 'variance':
				return VARIANCE_DURATION;
		}
	}

	private enterState(s: P1State): void {
		this.p1State = s;
		this.p1StateTimer = 0;
		const names = this.patternNamesForState(s);
		const configs: PatternConfig[] = names.map(n => Patterns[n]);
		this.setPatterns(configs);
	}

	private patternNamesForState(s: P1State): string[] {
		switch (s) {
			case 'swirl_fwd':
				return SWIRL_FWD_PATTERNS;
			case 'swirl_rev':
				return SWIRL_REV_PATTERNS;
			case 'variance':
				return VARIANCE_PATTERNS[GameState.difficulty];
		}
	}

	private updateP2(dt: number): void {
		this.p2StateTimer += dt;
		if (this.p2StateTimer >= P2_STATE_DURATION[GameState.difficulty]) {
			this.enterP2State(this.nextP2State(this.p2State));
		}
	}

	private nextP2State(s: P2State): P2State {
		if (s === 'fwd') return 'rev';
		if (s === 'rev') return 'flat';
		return 'fwd';
	}

	private enterP2State(s: P2State): void {
		this.p2State = s;
		this.p2StateTimer = 0;
		const names =
			s === 'fwd'
				? P2_FWD_PATTERNS
				: s === 'rev'
					? P2_REV_PATTERNS
					: P2_FLAT_PATTERNS;
		this.setPatterns(names.map(n => Patterns[n]));
	}

	private recordP3Target(): void {
		this.p3TargetX = Math.max(
			P3_TARGET_X_MARGIN,
			Math.min(FIELD.WIDTH - P3_TARGET_X_MARGIN, PlayerPosition.x)
		);
		this.p3TargetY = Math.max(
			P3_TARGET_Y_MIN,
			Math.min(P3_TARGET_Y_MAX, PlayerPosition.y)
		);
	}

	private updateP3(dt: number): void {
		switch (this.p3State) {
			case 'moving': {
				const dx = this.p3TargetX - this.x;
				const dy = this.p3TargetY - this.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				const step = P3_MOVE_SPEED * dt;
				this.isMoving = dist > 1;
				if (dist <= step) {
					this.x = this.p3TargetX;
					this.y = this.p3TargetY;
					this.isMoving = false;
					this.enterP3State('firing');
				} else {
					this.x += (dx / dist) * step;
					this.y += (dy / dist) * step;
				}
				break;
			}
			case 'firing': {
				this.isMoving = false;
				if (this.allPatternsDone()) {
					this.enterP3State('paused');
				}
				break;
			}
			case 'paused': {
				this.isMoving = false;
				this.p3StateTimer += dt;
				if (this.p3StateTimer >= P3_PAUSE_DURATION) {
					this.recordP3Target();
					this.enterP3State('moving');
				}
				break;
			}
		}
	}

	private enterP3State(s: P3State): void {
		this.p3State = s;
		this.p3StateTimer = 0;
		if (s === 'firing') {
			this.setPatterns(P3_PATTERNS.map(n => Patterns[n]));
		} else if (s === 'moving' || s === 'paused') {
			this.setPatterns([]);
		}
	}

	private updateP4(dt: number): void {
		const dx = P4_TARGET_X - this.x;
		const dy = P4_TARGET_Y - this.y;
		const dist = Math.sqrt(dx * dx + dy * dy);
		const step = P4_MOVE_SPEED * dt;
		if (dist > step) {
			this.x += (dx / dist) * step;
			this.y += (dy / dist) * step;
			this.isMoving = true;
		} else {
			this.x = P4_TARGET_X;
			this.y = P4_TARGET_Y;
			this.isMoving = false;
			if (!this.p4PatternsArmed) {
				this.p4PatternsArmed = true;
				this.setPatterns(P4_PATTERNS.map(n => Patterns[n]));
			}
		}
	}

	private updateP6(dt: number): void {
		const targetX = P6_POSITIONS_X[this.p6PositionIndex];
		const targetY = P6_TARGET_Y;
		const dx = targetX - this.x;
		const dy = targetY - this.y;
		const dist = Math.sqrt(dx * dx + dy * dy);
		if (!this.p6Firing) {
			const step = P6_MOVE_SPEED * dt;
			if (dist > step) {
				this.x += (dx / dist) * step;
				this.y += (dy / dist) * step;
				this.isMoving = true;
				return;
			}
			this.x = targetX;
			this.y = targetY;
			this.isMoving = false;
			this.p6Firing = true;
			this.setPatterns([Patterns[P6_PATTERN_NAME]]);
			return;
		}
		if (this.allPatternsDone()) {
			this.p6Firing = false;
			this.setPatterns([]);
			this.p6PositionIndex = (this.p6PositionIndex + 1) % P6_POSITIONS_X.length;
		}
	}
}
