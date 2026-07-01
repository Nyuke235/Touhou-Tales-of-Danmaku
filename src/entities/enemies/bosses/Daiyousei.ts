import { Boss, BossPhase, BossState } from '../../Boss';
import { Spritesheet, createExplosionSheet } from '../../../utils/Spritesheet';
import { Patterns } from '../../../patterns/PatternLibrary';

const PHASES: BossPhase[] = [
	{
		name: '',
		isSpellCard: false,
		hp: 325,
		timer: 30,
		barWeight: 0.45,
		drops: [
			{ type: 'bigpoint', count: 2 },
			{ type: 'power', count: 6 },
			{ type: 'life', count: 1 },
		],
		patterns: [
			Patterns.DAIYOUSEI_GREEN_HELIX_1,
			Patterns.DAIYOUSEI_GREEN_HELIX_2,
			Patterns.DAIYOUSEI_GREEN_HELIX_3,
			Patterns.DAIYOUSEI_GREEN_HELIX_4,
			Patterns.DAIYOUSEI_YELLOW_HELIX_1,
			Patterns.DAIYOUSEI_YELLOW_HELIX_2,
			Patterns.DAIYOUSEI_YELLOW_HELIX_3,
			Patterns.DAIYOUSEI_YELLOW_HELIX_4,
			Patterns.DAIYOUSEI_SUNFLOWER_CIRCLE,
			Patterns.DAIYOUSEI_JELLYBEAN_HELIX_E,
			Patterns.DAIYOUSEI_JELLYBEAN_HELIX_N,
			Patterns.DAIYOUSEI_JELLYBEAN_HELIX_H,
			Patterns.DAIYOUSEI_JELLYBEAN_HELIX_L,
			Patterns.DAIYOUSEI_JELLYBEAN_HELIX_H_REV,
			Patterns.DAIYOUSEI_JELLYBEAN_HELIX_L_REV,
		],
	},
	{
		name: "Fairy Sign 「Daiyousei's Vernal Storm」",
		isSpellCard: true,
		hp: 325,
		timer: 40,
		barWeight: 0.55,
		drops: [
			{ type: 'bigpoint', count: 4 },
			{ type: 'power', count: 10 },
			{ type: 'bomb', count: 1 },
		],
		patterns: [
			Patterns.DAIYOUSEI_SUNFLOWER_BOUNCE_EN,
			Patterns.DAIYOUSEI_SUNFLOWER_BOUNCE_H,
			Patterns.DAIYOUSEI_SUNFLOWER_BOUNCE_L,
			Patterns.DAIYOUSEI_CIRCLE_ARROWHEAD,
			Patterns.DAIYOUSEI_CIRCLE_AIMED_1,
			Patterns.DAIYOUSEI_CIRCLE_AIMED_2,
			Patterns.DAIYOUSEI_CIRCLE_AIMED_3,
		],
	},
];

const DRIFT_OFFSET_P1 = 95;
const DRIFT_OFFSET_P2 = 40;
const MOVE_INTERVAL_P1 = 8.0;
const MOVE_INTERVAL_P2 = 8.0;

export class Daiyousei extends Boss {
	private moveTimer: number = 0;

	constructor(x: number, y: number) {
		const idleSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/daiyousei/daiyousei_spritesheet.png',
			frameX: 32,
			frameY: 32,
			frameCount: 7,
			frameSpeed: 0.12,
			looping: true,
		});
		const movingSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/daiyousei/daiyouseimoving.png',
			frameX: 32,
			frameY: 32,
			frameCount: 1,
			frameSpeed: 1,
			looping: true,
		});
		const explSheet = createExplosionSheet();

		super(x, y, 32, 32, idleSheet, movingSheet, explSheet, PHASES);

		this.scoreValue = 100000;
		this.dialogueId = 'daiyousei';
		this.spellcardBgSrc =
			'assets/sprites/backgrounds/stage2_daiyousei_spellcard.png';
	}

	updateMovement(dt: number): void {
		if (this.handleEntryAndCharge(dt)) return;

		const moveInterval =
			this.currentPhaseIndex === 1 ? MOVE_INTERVAL_P2 : MOVE_INTERVAL_P1;
		const driftOffset =
			this.currentPhaseIndex === 1 ? DRIFT_OFFSET_P2 : DRIFT_OFFSET_P1;

		if (!this.ftmMoving && this.state === BossState.ACTIVE)
			this.moveTimer += dt;
		const shouldMove = this.moveTimer >= moveInterval;

		this.handleFtmMovement(dt, driftOffset, shouldMove, () => {
			this.moveTimer = 0;
			this.resetPatternEngines();
		});
	}
}
