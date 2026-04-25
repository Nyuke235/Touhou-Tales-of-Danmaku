import { Boss, BossPhase, BossState } from '../../Boss';
import { Spritesheet, createExplosionSheet } from '../../../utils/Spritesheet';
import { Patterns } from '../../../game/patterns/PatternLibrary';

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

export class RumiaDark extends Boss {
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

		this.scoreValue = 50000;
	}

	updateMovement(dt: number): void {
		if (this.handleEntryAndCharge(dt)) return;

		const driftOffset =
			this.currentPhaseIndex === 0 ? DRIFT_OFFSET_P1 : DRIFT_OFFSET_P2;

		let shouldMove = false;
		if (!this.ftmMoving && this.state === BossState.ACTIVE) {
			shouldMove =
				this.currentPhaseIndex === 1
					? (this.p2FireTimer += dt) >= RumiaDark.P2_MOVE_INTERVAL
					: this.allPatternsDone();
		}

		this.handleFtmMovement(dt, driftOffset, shouldMove, undefined, () => {
			this.resetPatternEngines();
			this.p2FireTimer = 0;
		});
	}
}
