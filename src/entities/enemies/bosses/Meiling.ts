import { Boss, BossPhase, BossState } from '../../Boss';
import { Spritesheet, createExplosionSheet } from '../../../utils/Spritesheet';
import { Patterns } from '../../../patterns/PatternLibrary';
import { PatternConfig, PatternEngine } from '../../../patterns/PatternEngine';
import { GameState, Difficulty } from '../../../game/GameState';
import { Music } from '../../../systems/MusicManager';
import { PlayerPosition } from '../../../game/PlayerPosition';
import { FIELD } from '../../../game/Constants';

const PHASES: BossPhase[] = [
	{
		name: '',
		isSpellCard: false,
		hp: 300,
		timer: 35,
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
		timer: 40,
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
		timer: 40,
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
		timer: 40,
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
		timer: 35,
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
		timer: 45,
		drops: [
			{ type: 'bigpoint', count: 6 },
			{ type: 'power', count: 8 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [],
	},
	{
		name: 'Gate Sign 「Five Elements Eight Trigrams Palm」',
		isSpellCard: true,
		hp: 500,
		timer: 50,
		drops: [
			{ type: 'bigpoint', count: 6 },
			{ type: 'power', count: 8 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [],
	},
];

const DRIFT_OFFSET = 60;
const MOVE_INTERVAL = 3.2;

const P1_SWIRL_FWD_PATTERNS = [
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
const P1_SWIRL_REV_PATTERNS = [
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
const P1_VARIANCE_PATTERNS: Record<Difficulty, string[]> = {
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
const P1_SWIRL_FWD_DURATION = 1.8;
const P1_SWIRL_REV_DURATION = 1.8;
const P1_VARIANCE_DURATION = 1.6;

type P1State = 'swirl_fwd' | 'swirl_rev' | 'variance';

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

type P2State = 'fwd' | 'rev' | 'flat';

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

type P3State = 'moving' | 'firing' | 'paused';

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

const P5_BALL_PATTERNS = [
	'S3_MEILING_BOSS_P5_BALL_N',
	'S3_MEILING_BOSS_P5_BALL_H',
	'S3_MEILING_BOSS_P5_BALL_L',
];
const P5_FWD_PATTERNS = [
	'S3_MEILING_BOSS_P5_RING_RED',
	'S3_MEILING_BOSS_P5_RING_PURPLE',
	'S3_MEILING_BOSS_P5_RING_BLUE',
	'S3_MEILING_BOSS_P5_RING_CYAN',
	'S3_MEILING_BOSS_P5_RING_GREEN',
	'S3_MEILING_BOSS_P5_RING_YELLOW',
	'S3_MEILING_BOSS_P5_RING_ORANGE',
	...P5_BALL_PATTERNS,
];
const P5_REV_PATTERNS = [
	'S3_MEILING_BOSS_P5_RING_REV_RED',
	'S3_MEILING_BOSS_P5_RING_REV_PURPLE',
	'S3_MEILING_BOSS_P5_RING_REV_BLUE',
	'S3_MEILING_BOSS_P5_RING_REV_CYAN',
	'S3_MEILING_BOSS_P5_RING_REV_GREEN',
	'S3_MEILING_BOSS_P5_RING_REV_YELLOW',
	'S3_MEILING_BOSS_P5_RING_REV_ORANGE',
	...P5_BALL_PATTERNS,
];
const P5_STATE_DURATION: Record<Difficulty, number> = {
	EASY: 1.4,
	NORMAL: 1.4,
	HARD: 1.2,
	LUNATIC: 1.0,
};

type P5State = 'fwd' | 'rev';

const P6_FOUNTAIN_NAMES: Record<Difficulty, string> = {
	EASY: 'S3_MEILING_BOSS_P6_FOUNTAIN_E',
	NORMAL: 'S3_MEILING_BOSS_P6_FOUNTAIN_N',
	HARD: 'S3_MEILING_BOSS_P6_FOUNTAIN_H',
	LUNATIC: 'S3_MEILING_BOSS_P6_FOUNTAIN_L',
};
const P6_EDGE_SWARM_NAME = 'S3_MEILING_BOSS_P6_EDGE_SWARM';
const P6_ORB_NAMES: Record<Difficulty, string[]> = {
	EASY: [],
	NORMAL: [],
	HARD: ['S3_MEILING_BOSS_P6_ORBS_H'],
	LUNATIC: [
		'S3_MEILING_BOSS_P6_ORBS_L1',
		'S3_MEILING_BOSS_P6_ORBS_L2',
		'S3_MEILING_BOSS_P6_ORBS_L3',
	],
};
const P6_TARGET_Y = 50;
const P6_MOVE_SPEED = 130;
const P6_POSITIONS_X = [
	FIELD.WIDTH / 2,
	FIELD.WIDTH * 0.33,
	FIELD.WIDTH / 2,
	FIELD.WIDTH * 0.67,
];

type P6State = 'moving' | 'firing';

interface PhaseHandler {
	enter: () => void;
	update: (dt: number) => void;
}

const P7_PATTERNS = [
	'S3_MEILING_BOSS_P7_BUBBLES_EN',
	'S3_MEILING_BOSS_P7_BUBBLES_HL',
	'S3_MEILING_BOSS_P7_HELIX_RICE_E',
	'S3_MEILING_BOSS_P7_HELIX_RICE_NH',
	'S3_MEILING_BOSS_P7_HELIX_RICE_L',
	'S3_MEILING_BOSS_P7_HELIX_ROCK_E',
	'S3_MEILING_BOSS_P7_HELIX_ROCK_N',
	'S3_MEILING_BOSS_P7_HELIX_ROCK_H',
	'S3_MEILING_BOSS_P7_HELIX_ROCK_L',
];
const P7_TARGET_X = FIELD.WIDTH / 2;
const P7_TARGET_Y = 60;
const P7_MOVE_SPEED = 160;

export class MeilingBoss extends Boss {
	private lastPhaseIndex: number = -1;

	private p1State: P1State = 'swirl_fwd';
	private p1StateTimer: number = 0;

	private p2State: P2State = 'fwd';
	private p2StateTimer: number = 0;

	private p3State: P3State = 'moving';
	private p3StateTimer: number = 0;
	private p3TargetX: number = 0;
	private p3TargetY: number = 0;

	private p4PatternsArmed: boolean = false;

	private p5State: P5State = 'fwd';
	private p5StateTimer: number = 0;

	private p6State: P6State = 'moving';
	private p6PositionIndex: number = 0;
	private p6EdgeEngine: PatternEngine | null = null;
	private p6OrbEngines: PatternEngine[] = [];

	private p7PatternsArmed: boolean = false;

	private moveTimer: number = 0;

	private readonly phaseHandlers: PhaseHandler[] = [
		{
			enter: () => this.p1EnterState('swirl_fwd'),
			update: dt => {
				this.updateP1(dt);
				this.driftFtm(dt);
			},
		},
		{
			enter: () => this.p2EnterState('fwd'),
			update: dt => {
				this.updateP2(dt);
				this.driftFtm(dt);
			},
		},
		{ enter: () => this.p3Enter(), update: dt => this.updateP3(dt) },
		{ enter: () => this.p4Enter(), update: dt => this.updateP4(dt) },
		{
			enter: () => this.p5EnterState('fwd'),
			update: dt => {
				this.updateP5(dt);
				this.driftFtm(dt);
			},
		},
		{ enter: () => this.p6Enter(), update: dt => this.updateP6(dt) },
		{ enter: () => this.p7Enter(), update: dt => this.updateP7(dt) },
	];

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
		if (this.state !== BossState.ACTIVE) return;

		const handler = this.phaseHandlers[this.currentPhaseIndex];
		if (!handler) return;

		if (this.currentPhaseIndex !== this.lastPhaseIndex) {
			this.lastPhaseIndex = this.currentPhaseIndex;
			handler.enter();
		}
		handler.update(dt);
	}

	// ---------- Helpers ----------

	private moveToward(
		dt: number,
		tx: number,
		ty: number,
		speed: number
	): boolean {
		const dx = tx - this.x;
		const dy = ty - this.y;
		const dist = Math.sqrt(dx * dx + dy * dy);
		const step = speed * dt;
		if (dist <= step) {
			this.x = tx;
			this.y = ty;
			this.isMoving = false;
			return true;
		}
		this.x += (dx / dist) * step;
		this.y += (dy / dist) * step;
		this.isMoving = true;
		return false;
	}

	private driftFtm(dt: number): void {
		if (!this.ftmMoving) this.moveTimer += dt;
		const shouldMove = this.moveTimer >= MOVE_INTERVAL;
		this.handleFtmMovement(dt, DRIFT_OFFSET, shouldMove, () => {
			this.moveTimer = 0;
		});
	}

	private setPatternsByName(names: string[]): void {
		this.setPatterns(names.map(n => Patterns[n]!));
	}

	// ---------- Phase 1 ----------

	private updateP1(dt: number): void {
		this.p1StateTimer += dt;
		if (this.p1StateTimer >= this.p1StateDuration(this.p1State)) {
			this.p1EnterState(this.p1NextState(this.p1State));
		}
	}

	private p1NextState(s: P1State): P1State {
		if (s === 'swirl_fwd') {
			const diff = GameState.difficulty;
			return diff === 'HARD' || diff === 'LUNATIC' ? 'swirl_rev' : 'variance';
		}
		if (s === 'swirl_rev') return 'variance';
		return 'swirl_fwd';
	}

	private p1StateDuration(s: P1State): number {
		switch (s) {
			case 'swirl_fwd':
				return P1_SWIRL_FWD_DURATION;
			case 'swirl_rev':
				return P1_SWIRL_REV_DURATION;
			case 'variance':
				return P1_VARIANCE_DURATION;
		}
	}

	private p1EnterState(s: P1State): void {
		this.p1State = s;
		this.p1StateTimer = 0;
		switch (s) {
			case 'swirl_fwd':
				return this.setPatternsByName(P1_SWIRL_FWD_PATTERNS);
			case 'swirl_rev':
				return this.setPatternsByName(P1_SWIRL_REV_PATTERNS);
			case 'variance':
				return this.setPatternsByName(
					P1_VARIANCE_PATTERNS[GameState.difficulty]
				);
		}
	}

	// ---------- Phase 2 ----------

	private updateP2(dt: number): void {
		this.p2StateTimer += dt;
		if (this.p2StateTimer >= P2_STATE_DURATION[GameState.difficulty]) {
			this.p2EnterState(this.p2NextState(this.p2State));
		}
	}

	private p2NextState(s: P2State): P2State {
		if (s === 'fwd') return 'rev';
		if (s === 'rev') return 'flat';
		return 'fwd';
	}

	private p2EnterState(s: P2State): void {
		this.p2State = s;
		this.p2StateTimer = 0;
		const names =
			s === 'fwd'
				? P2_FWD_PATTERNS
				: s === 'rev'
					? P2_REV_PATTERNS
					: P2_FLAT_PATTERNS;
		this.setPatternsByName(names);
	}

	// ---------- Phase 3 ----------

	private p3Enter(): void {
		this.p3RecordTarget();
		this.p3EnterState('moving');
	}

	private p3RecordTarget(): void {
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
			case 'moving':
				if (
					this.moveToward(dt, this.p3TargetX, this.p3TargetY, P3_MOVE_SPEED)
				) {
					this.p3EnterState('firing');
				}
				break;
			case 'firing':
				this.isMoving = false;
				if (this.allPatternsDone()) this.p3EnterState('paused');
				break;
			case 'paused':
				this.isMoving = false;
				this.p3StateTimer += dt;
				if (this.p3StateTimer >= P3_PAUSE_DURATION) {
					this.p3RecordTarget();
					this.p3EnterState('moving');
				}
				break;
		}
	}

	private p3EnterState(s: P3State): void {
		this.p3State = s;
		this.p3StateTimer = 0;
		if (s === 'firing') this.setPatternsByName(P3_PATTERNS);
		else this.setPatterns([]);
	}

	// ---------- Phase 4 ----------

	private p4Enter(): void {
		this.p4PatternsArmed = false;
		this.setPatterns([]);
	}

	private updateP4(dt: number): void {
		if (this.moveToward(dt, P4_TARGET_X, P4_TARGET_Y, P4_MOVE_SPEED)) {
			if (!this.p4PatternsArmed) {
				this.p4PatternsArmed = true;
				this.setPatternsByName(P4_PATTERNS);
			}
		}
	}

	// ---------- Phase 5 ----------

	private updateP5(dt: number): void {
		this.p5StateTimer += dt;
		if (this.p5StateTimer >= P5_STATE_DURATION[GameState.difficulty]) {
			this.p5EnterState(this.p5State === 'fwd' ? 'rev' : 'fwd');
		}
	}

	private p5EnterState(s: P5State): void {
		this.p5State = s;
		this.p5StateTimer = 0;
		this.setPatternsByName(s === 'fwd' ? P5_FWD_PATTERNS : P5_REV_PATTERNS);
	}

	// ---------- Phase 6 ----------

	private p6Enter(): void {
		this.p6PositionIndex = 0;
		this.p6State = 'moving';
		this.p6EdgeEngine = new PatternEngine(GameState.difficulty);
		this.p6OrbEngines = P6_ORB_NAMES[GameState.difficulty].map(
			() => new PatternEngine(GameState.difficulty)
		);
		this.p6ApplyPatterns(null);
	}

	private updateP6(dt: number): void {
		if (this.p6State === 'moving') {
			const targetX = P6_POSITIONS_X[this.p6PositionIndex]!;
			if (this.moveToward(dt, targetX, P6_TARGET_Y, P6_MOVE_SPEED)) {
				this.p6State = 'firing';
				this.p6ApplyPatterns(new PatternEngine(GameState.difficulty));
			}
			return;
		}

		const fountainIdx = this.patterns.length - 1;
		if (this.engines[fountainIdx]!.isDone(this.patterns[fountainIdx]!)) {
			this.p6State = 'moving';
			this.p6PositionIndex = (this.p6PositionIndex + 1) % P6_POSITIONS_X.length;
			this.p6ApplyPatterns(null);
		}
	}

	private p6ApplyPatterns(fountainEngine: PatternEngine | null): void {
		const patterns: PatternConfig[] = [Patterns[P6_EDGE_SWARM_NAME]!];
		const engines: PatternEngine[] = [this.p6EdgeEngine!];
		const orbNames = P6_ORB_NAMES[GameState.difficulty];
		for (let i = 0; i < orbNames.length; i++) {
			patterns.push(Patterns[orbNames[i]!]!);
			engines.push(this.p6OrbEngines[i]!);
		}
		if (fountainEngine) {
			patterns.push(Patterns[P6_FOUNTAIN_NAMES[GameState.difficulty]]!);
			engines.push(fountainEngine);
		}
		this.patterns = patterns;
		this.engines = engines;
	}

	// ---------- Phase 7 ----------

	private p7Enter(): void {
		this.p7PatternsArmed = false;
		this.setPatterns([]);
	}

	private updateP7(dt: number): void {
		if (this.moveToward(dt, P7_TARGET_X, P7_TARGET_Y, P7_MOVE_SPEED)) {
			if (!this.p7PatternsArmed) {
				this.p7PatternsArmed = true;
				this.setPatternsByName(P7_PATTERNS);
			}
		}
	}
}
