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
		patterns: [
			Patterns.RUMIALANTERN_CIRCLE_RIGHT_PAUSE_E,
			Patterns.RUMIALANTERN_CIRCLE_LEFT_PAUSE_E,
			Patterns.RUMIALANTERN_CIRCLE_RIGHT_PAUSE_N,
			Patterns.RUMIALANTERN_CIRCLE_LEFT_PAUSE_N,
			Patterns.RUMIALANTERN_CIRCLE_RIGHT_PAUSE_H,
			Patterns.RUMIALANTERN_CIRCLE_LEFT_PAUSE_H,
			Patterns.RUMIALANTERN_CIRCLE_RIGHT_PAUSE_L,
			Patterns.RUMIALANTERN_CIRCLE_LEFT_PAUSE_L,
			Patterns.RUMIALANTERN_CIRCLE_SLOW_EN,
			Patterns.RUMIALANTERN_CIRCLE_SLOW_H,
			Patterns.RUMIALANTERN_CIRCLE_SLOW_L,
		],
	},
	{
		name: 'Dark Sign 「Boundary of Jet-Black」',
		isSpellCard: true,
		hp: 220,
		timer: 40,
		barWeight: 0.5,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [
			Patterns.RUMIALANTERN_DARK_TENTACLES,
			Patterns.RUMIALANTERN_DARK_STARS_ENH,
			Patterns.RUMIALANTERN_DARK_STARS_INV_H,
			Patterns.RUMIALANTERN_DARK_STARS_L,
			Patterns.RUMIALANTERN_DARK_STARS_INV_L,
			Patterns.RUMIALANTERN_RICE_CIRCLE_N,
			Patterns.RUMIALANTERN_RICE_CIRCLE_H,
			Patterns.RUMIALANTERN_RICE_CIRCLE_L,
		],
	},
];

const DRIFT_OFFSET_P1 = 50;

const P2_CENTER_X = 128;
const P2_CENTER_Y = 100;
const P2_RADIUS_X = 80;
const P2_RADIUS_Y = 40;
const P2_ANGULAR_VEL = 0.7;

export class RumiaLantern extends Boss {
	private p2Angle: number = -Math.PI / 2;

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

		if (this.currentPhaseIndex === 1 && this.state === BossState.ACTIVE) {
			this.p2Angle += P2_ANGULAR_VEL * dt;
			this.x = P2_CENTER_X + Math.cos(this.p2Angle) * P2_RADIUS_X;
			this.y = P2_CENTER_Y + Math.sin(this.p2Angle) * P2_RADIUS_Y;
			this.isMoving = true;
			if (this.allPatternsDone()) this.resetPatternEngines();
			return;
		}

		let shouldMove = false;
		if (!this.ftmMoving && this.state === BossState.ACTIVE) {
			shouldMove = this.allPatternsDone();
		}

		this.handleFtmMovement(dt, DRIFT_OFFSET_P1, shouldMove, undefined, () => {
			this.resetPatternEngines();
		});
	}
}
