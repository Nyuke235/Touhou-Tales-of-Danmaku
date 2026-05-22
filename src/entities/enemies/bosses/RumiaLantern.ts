import { Boss, BossPhase, BossState } from '../../Boss';
import { Spritesheet, createExplosionSheet } from '../../../utils/Spritesheet';
import { Patterns } from '../../../patterns/PatternLibrary';

const PHASES: BossPhase[] = [
	{
		name: '',
		isSpellCard: false,
		hp: 220,
		timer: 35,
		barWeight: 0.5,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'life', count: 1 },
		],
		patterns: [],
	},
	{
		name: 'Lantern Sign 「???」',
		isSpellCard: true,
		hp: 220,
		timer: 40,
		barWeight: 0.5,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [],
	},
];

const DRIFT_OFFSET_P1 = 50;
const DRIFT_OFFSET_P2 = 70;
const MOVE_INTERVAL_P2 = 7.0;

export class RumiaLantern extends Boss {
	private p2FireTimer: number = 0;

	constructor(x: number, y: number) {
		const sheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/rumia/rumialantern.png',
			frameX: 32,
			frameY: 32,
			frameCount: 1,
			frameSpeed: 1,
			looping: true,
		});
		const movingSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/rumia/rumialantern.png',
			frameX: 32,
			frameY: 32,
			frameCount: 1,
			frameSpeed: 1,
			looping: true,
		});
		const explSheet = createExplosionSheet();

		super(x, y, 32, 32, sheet, movingSheet, explSheet, PHASES);

		this.scoreValue = 50000;
		this.dialogueId = 'rumialantern';
	}

	updateMovement(dt: number): void {
		if (this.handleEntryAndCharge(dt)) return;

		const driftOffset =
			this.currentPhaseIndex === 0 ? DRIFT_OFFSET_P1 : DRIFT_OFFSET_P2;

		let shouldMove = false;
		if (!this.ftmMoving && this.state === BossState.ACTIVE) {
			shouldMove =
				this.currentPhaseIndex === 1
					? (this.p2FireTimer += dt) >= MOVE_INTERVAL_P2
					: this.allPatternsDone();
		}

		this.handleFtmMovement(dt, driftOffset, shouldMove, undefined, () => {
			this.resetPatternEngines();
			this.p2FireTimer = 0;
		});
	}
}
