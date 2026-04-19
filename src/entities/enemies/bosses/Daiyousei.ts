import { Boss, BossPhase, BossState } from '../../Boss';
import { Spritesheet, createExplosionSheet } from '../../../utils/Spritesheet';
import { SoundManager, SFX } from '../../../systems/SoundManager';
import { Patterns } from '../../../game/patterns/PatternLibrary';
import { BOSS, BOSS_ENTRY } from '../../../game/Constants';

const PHASES: BossPhase[] = [
	{
		name: '',
		isSpellCard: false,
		hp: 325,
		timer: 40,
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
		],
	},
	{
		name: "Fairy Sign 「Daiyousei's Vernal Storm」",
		isSpellCard: true,
		hp: 325,
		timer: 45,
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
		],
	},
];

const DRIFT_OFFSET_P1 = 95;
const DRIFT_OFFSET_P2 = 40;
const DRIFT_LERP = 2.5;
const MOVE_INTERVAL_P1 = 8.0;
const MOVE_INTERVAL_P2 = 8.0;

export class Daiyousei extends Boss {
	private entered: boolean = false;
	private charging: boolean = false;
	private chargeSheet!: Spritesheet;

	private ftmMoving: boolean = false;
	private ftmMoveDir: number = 1;
	private ftmMoveTarget: number = BOSS.CENTER_X;
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

		this.chargeSheet = new Spritesheet({
			src: 'assets/sprites/effects/bosscharge.png',
			frameX: 64,
			frameY: 64,
			frameCount: 9,
			frameSpeed: 0.07,
			looping: false,
		});

		this.scoreValue = 100000;
		this.spellcardBgSrc =
			'assets/sprites/backgrounds/stage2_daiyousei_spellcard.png';
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

		const moveInterval =
			this.currentPhaseIndex === 1 ? MOVE_INTERVAL_P2 : MOVE_INTERVAL_P1;

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
				if (this.moveTimer >= moveInterval) {
					this.ftmMoving = true;
					this.ftmMoveDir = -this.ftmMoveDir;
					const driftOffset =
						this.currentPhaseIndex === 1 ? DRIFT_OFFSET_P2 : DRIFT_OFFSET_P1;
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
