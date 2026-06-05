import { Enemy } from '../Enemy';
import { Spritesheet, createExplosionSheet } from '../../utils/Spritesheet';
import { IBullet } from '../Bullet';
import { ENEMY_MOVEMENT } from '../../game/Constants';
import { SFX } from '../../systems/SoundManager';
import { PatternConfig } from '../../patterns/PatternEngine';

const DESCENT_SPEED = ENEMY_MOVEMENT.MANDRAGORA_SPEED;
const FIRE_ANIM_W = 80;
const FIRE_ANIM_H = 80;
const FIRE_ANIM_FRAMES = 8;
const FIRE_ANIM_FRAME_SPEED = 0.05;

export class FairyCannon extends Enemy {
	private fireSheet: Spritesheet | null = null;

	constructor(x: number, y: number, patterns?: PatternConfig[]) {
		const sheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/fairies/cannonfairy.png',
			frameX: 39,
			frameY: 40,
			frameCount: 1,
			frameSpeed: 1,
			looping: true,
		});
		super(x, y, 32, 32, 26, sheet, createExplosionSheet());
		this.scoreValue = 4000;
		this.drops = [
			{ type: 'point', count: 5 },
			{ type: 'power', count: 5 },
		];
		if (patterns) this.setPatterns(patterns);
	}

	override update(
		dt: number,
		px: number,
		py: number,
		enemyBullets: IBullet[]
	): void {
		const prevCount = enemyBullets.length;
		super.update(dt, px, py, enemyBullets);
		if (enemyBullets.length > prevCount && !this.exploding) {
			this.fireSheet = new Spritesheet({
				src: 'assets/sprites/effects/cannonfire.png',
				frameX: FIRE_ANIM_W,
				frameY: FIRE_ANIM_H,
				frameCount: FIRE_ANIM_FRAMES,
				frameSpeed: FIRE_ANIM_FRAME_SPEED,
				looping: false,
			});
		}
		if (this.fireSheet) {
			this.fireSheet.update(dt);
			if (this.fireSheet.isFinished()) this.fireSheet = null;
		}
	}

	updateMovement(dt: number): void {
		this.y += DESCENT_SPEED * dt;
	}

	override render(ctx: CanvasRenderingContext2D): void {
		super.render(ctx);
		if (this.fireSheet && !this.exploding) {
			this.fireSheet.draw(
				ctx,
				this.x - FIRE_ANIM_W / 2,
				this.y - FIRE_ANIM_H / 2,
				FIRE_ANIM_W,
				FIRE_ANIM_H
			);
		}
	}

	protected override shotSFX(): string {
		return SFX.CANNON_FIRE;
	}
}
